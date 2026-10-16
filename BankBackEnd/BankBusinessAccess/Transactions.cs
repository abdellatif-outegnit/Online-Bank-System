using BankDataAccess;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace BankBusinessAccess
{
    public class Transactions
    {

        public class AccountTransactionsDTO
        {
            public int AccountID { get; set; }
            public AccountsDTO.AccountTypeEnum AccountType { get; set; }
            public decimal Balance { get; set; } 
            public List<TransactionsDTO> Transactions { get; set; }
        }

        static public async Task<TransactionResult> getAllTransactionsUsingCustomerID(int userId, int PageNumber)
        {
            int PageSize = 5;

            Users? user = Users.Find(userId);

            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            var result = await TransactionsData.GetCustomerTransactions(user.userResponseDTO.CustomerID, PageNumber , PageSize);

            result.pagesNumber = (int)Math.Ceiling((double)result.TotalCount / PageSize); 

            return result;

        }

        static public async Task<TransactionResult> getAllFilteredTransactionsUsingCustomerID(int userId, int PageNumber, List<byte> TransType, int pageSize, byte? AccountType = null, byte? status = null, DateTime? FromDate = null, DateTime? ToDate = null)
        {
            Users? user = Users.Find(userId);

            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            var result = await TransactionsData.GetCustomerFiltredTransactions(user.userResponseDTO.CustomerID, PageNumber, pageSize,  TransType, AccountType, status, FromDate, ToDate);

            result.pagesNumber = (int)Math.Ceiling((double)result.TotalCount / pageSize);

            return result;

        }

        static private bool _VerifyAccountOwnership(int userId, string fromAccountNumber)
        {
            Users? user = Users.Find(userId);

            if (user == null)
            {
                return false;
            }

            var fromAccount = Accounts.GetAllAccountsByCustomerID(user.userResponseDTO.CustomerID);

            if (fromAccount == null)
            {
                return false;
            }

            var check = fromAccount.Find(a => a.AccountNumber == fromAccountNumber);

            if(check == null) 
                return false;


            return true;
        }

        static public List<AccountTransactionsDTO> GetAllTransactionByUser(int userId)
        {

            List<AccountTransactionsDTO> data = new List<AccountTransactionsDTO>();

            Users? user = Users.Find(userId);

            if (user != null)
            {
                var accounts = Accounts.GetAllAccountsByCustomerID(user.userResponseDTO.CustomerID);

                foreach (var account in accounts) {
                    data.Add(
                        new AccountTransactionsDTO
                        { 
                            AccountID = account.AccountID,
                            AccountType = account.AccountType ,
                            Balance = account.AccountBalance,
                            Transactions = TransactionsData.getTransactionsByAccountID(account.AccountID)
                        }
                    );
                }
            }

            return data;
        }

        static public bool Transfer(int userId, string fromAccountNumber, string toAccountNumber, decimal amount)
        {

            if (amount <= 0)
            {
                throw new ArgumentException("Transfer amount must be greater than zero.");
            }

            if(!_VerifyAccountOwnership(userId , fromAccountNumber))
            {
                throw new UnauthorizedAccessException("User is not authorized to perform this transfer.");
            }

            using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
            {
                connection.Open();

                SqlTransaction transaction = connection.BeginTransaction();

                try
                {
                    //Lock the Accounts

                    List<Accounts> lockedAccounts = Accounts.FindByAccountNumberWithLock(fromAccountNumber, toAccountNumber, connection, transaction);

                    if (lockedAccounts.Count != 2)
                    {
                        throw new Exception("One or both accounts not found.");
                    }

                    Accounts? fromAccount = lockedAccounts.FirstOrDefault(a => a._AccountsDTO.AccountNumber == fromAccountNumber);

                    Accounts? toAccount = lockedAccounts.FirstOrDefault(a => a._AccountsDTO.AccountNumber == toAccountNumber);

                    if (fromAccount == null || toAccount == null)
                    {
                        throw new Exception("One or both accounts not found.");
                    }

                    if (fromAccount._AccountsDTO.AccountBalance < amount)
                    {
                        throw new Exception("Insufficient funds in the source account.");
                    }

                    fromAccount._AccountsDTO.AccountBalance -= amount;

                    toAccount._AccountsDTO.AccountBalance += amount;


                    AccountsData.UpdateAccount(fromAccount._AccountsDTO, connection, transaction);

                    AccountsData.UpdateAccount(toAccount._AccountsDTO, connection, transaction);

                    string SharedReference = Guid.NewGuid().ToString();

                    TransactionsDTO trans = new TransactionsDTO()
                    { 
                        TransactionType = TransactionsDTO.transType.transferTo,
                        Amount = amount,
                        BalanceAfter = fromAccount._AccountsDTO.AccountBalance,
                        Status = TransactionsDTO.transStatus.completed,
                        Reference = SharedReference,
                        AccountID = fromAccount._AccountsDTO.AccountID,
                        RelatedAccountID = toAccount._AccountsDTO.AccountID,
                    };

                    TransactionsDTO trans2 = new TransactionsDTO()
                    {
                        TransactionType = TransactionsDTO.transType.transferFrom,
                        Amount = amount,
                        BalanceAfter = toAccount._AccountsDTO.AccountBalance,
                        Status = TransactionsDTO.transStatus.completed,
                        Reference = SharedReference,
                        AccountID = toAccount._AccountsDTO.AccountID,
                        RelatedAccountID = fromAccount._AccountsDTO.AccountID,
                    };

                    trans.TransactionID = TransactionsData.AddTransaction(trans, connection, transaction);

                    trans2.TransactionID = TransactionsData.AddTransaction(trans2, connection, transaction);

                    transaction.Commit();

                    return true;
                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }

        static public bool Deposit(int userId, string accountNumber, decimal amount)
        {
            if (amount <= 0)
            {
                throw new ArgumentException("Deposit amount must be greater than zero.");
            }

            if (!_VerifyAccountOwnership(userId, accountNumber))
            {
                throw new UnauthorizedAccessException("User is not authorized to perform this transfer.");
            }

            using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
            {
                connection.Open();

                SqlTransaction transaction = connection.BeginTransaction();

                try
                {

                    Accounts account = Accounts.FindByAccountNumber(accountNumber, connection, transaction);

                    account._AccountsDTO.AccountBalance += amount;

                    AccountsData.UpdateAccount(account._AccountsDTO, connection, transaction);

                    TransactionsDTO trans = new TransactionsDTO()
                    {
                        TransactionType = TransactionsDTO.transType.deposit,
                        Amount = amount,
                        BalanceAfter = account._AccountsDTO.AccountBalance,
                        Status = TransactionsDTO.transStatus.completed,
                        Reference = Guid.NewGuid().ToString(),
                        AccountID = account._AccountsDTO.AccountID,
                    };

                    trans.TransactionID = TransactionsData.AddTransaction(trans, connection, transaction);

                    transaction.Commit();

                    return true;

                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            } 
        }

        static public bool Withdraw(int userId, string accountNumber, decimal amount)
        {
            if (amount <= 0)
            {
                throw new ArgumentException("withdraw amount must be greater than zero.");
            }

            if (!_VerifyAccountOwnership(userId, accountNumber))
            {
                throw new UnauthorizedAccessException("User is not authorized to perform this transfer.");
            }

            using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
            {
                connection.Open();

                SqlTransaction transaction = connection.BeginTransaction();

                try
                {

                    Accounts account = Accounts.FindByAccountNumber(accountNumber, connection, transaction);

                    if (account._AccountsDTO.AccountBalance < amount)
                    {
                        throw new ArgumentException("withdraw amount is greater than account balance.");
                    }

                    account._AccountsDTO.AccountBalance -= amount;

                    AccountsData.UpdateAccount(account._AccountsDTO, connection, transaction);

                    TransactionsDTO trans = new TransactionsDTO()
                    {
                        TransactionType = TransactionsDTO.transType.withdraw,
                        Amount = amount,
                        BalanceAfter = account._AccountsDTO.AccountBalance,
                        Status = TransactionsDTO.transStatus.completed,
                        Reference = Guid.NewGuid().ToString(),
                        AccountID = account._AccountsDTO.AccountID,
                    };

                    trans.TransactionID = TransactionsData.AddTransaction(trans, connection, transaction);

                    transaction.Commit();

                    return true;

                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }

    }
}
