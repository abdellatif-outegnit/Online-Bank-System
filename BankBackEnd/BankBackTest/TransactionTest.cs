using BankBusinessAccess;
using BankDataAccess;
using Microsoft.Data.SqlClient;

namespace BankBackTest
{
    public class TransactionTest
    {

        int userIdTest = 2021;
        string accountNumberTest = "9999999999999999";

        [Theory]
        [InlineData(0)]
        [InlineData(-100)]
        public void Withdraw_WhenAmountIsNotPositive_ThrowsArgumentException(decimal amount)
        {
            // Act + Assert
            Assert.Throws<ArgumentException>(() =>
                Transactions.Withdraw(userIdTest, accountNumberTest, amount));

        }

        [Fact]
        public void Withdraw_succeeded()
        {
          
            // Arrange: reset the test account's balance.
            using (var connection = new SqlConnection(SettingsData.ConnectionString))
            {
                connection.Open();

                using (var command = new SqlCommand(
                    @"UPDATE Accounts
                  SET AccountBalance = 1000
                  WHERE AccountNumber = @AccountNumber",
                    connection))
                {
                    command.Parameters.AddWithValue(
                        "@AccountNumber", accountNumberTest);

                    Assert.Equal(1, command.ExecuteNonQuery());
                }
            }

            // Act: withdraw 200.
            bool result = Transactions.Withdraw(userIdTest, accountNumberTest, 200);

            // Assert: withdrawal succeeded.
            Assert.True(result);


            // Assert: the balance is now 800.
            using (var connection = new SqlConnection(SettingsData.ConnectionString))
            {
                connection.Open();

                using (var command = new SqlCommand(
                    @"SELECT AccountBalance
                  FROM Accounts
                  WHERE AccountNumber = @AccountNumber",
                    connection))
                {
                    command.Parameters.AddWithValue(
                        "@AccountNumber", accountNumberTest);

                    decimal balance =
                        (decimal)command.ExecuteScalar();

                    Assert.Equal(800, balance);
                }
            }

        }
    }
}