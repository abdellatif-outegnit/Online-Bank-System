import Style from "./Account.module.css";
import { Plus , Undo2 , HandCoins , CreditCard , CloudSync , BanknoteArrowUp , BanknoteArrowDown } from 'lucide-react';
import { useState, useEffect} from 'react';
import AddAccount from "../AddAccount/AddAccount";
import {apiFetch} from "../../utils/functions/ApiFunction";
import Transfer from "../Transfer/Transfer";
import Deposit from "../Deposit/Deposit";
import Withdraw from "../Withdraw/Withdraw";
import { useTranslation } from 'react-i18next';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useUser } from "../../context/userContext";


const Account = () => {

    const { user } = useUser();

    const [accounts, setAccounts] = useState([]);
    
    const [transAccounts, setTransAccounts] = useState([]);

    const [addStatus, setAddStatus] = useState(false);

    const [ActionBtn, setActionBtn] = useState("Transfer");

    const [isLoading, setIsLoading] = useState(false);

    const { t } = useTranslation();

    useEffect(() =>{

        setIsLoading(true);

        let isMounted = true;

        if(!user)
        {
            setIsLoading(false);
            return;
        }

        async function GetAccounts() {

            try {
                const response = await apiFetch(`https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Accounts/${user?.customerID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }, user?.emailAddress);
    
                
                if(response.ok)
                {
                    const data = await response.json();
    
                    if (isMounted) {
                        setAccounts(data);
                        setIsLoading(false);
                    }
                }

            } catch (error) {
                console.error('Error fetching accounts:', error);
                setIsLoading(false);
            }
        }

        GetAccounts();

        return () => {
            isMounted = false;
            setIsLoading(false);
        };

    }, [user]);

    useEffect(() =>{

        let isMounted = true;

        if(!user)
        {
            isMounted = false;
            return;
        }

        async function GetAccountsTransaction() {

            try {
                const response = await apiFetch(`https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Transfers/All`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }, user?.emailAddress);
    
                
                if(response.ok)
                {
                    const data = await response.json();
    
                    if (isMounted) {
                        setTransAccounts(data);
                    }
                }

            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        }

        GetAccountsTransaction();

        return () => {
            isMounted = false;
        };

    }, [user]);

    let Transactions = transAccounts.map((trans) => {

       const outcome = trans?.transactions?.reduce((total, transaction) => {
            if (transaction.transactionType === "transferTo") {
                return total + transaction.amount;
            }

            return total;
        }, 0);

        const income = trans?.transactions?.reduce((total, transaction) => {
            if (transaction.transactionType === "transferFrom") {
                return total + transaction.amount;
            }
            return total;
        }, 0)

        return(
            <div key={trans?.accountID} style={{marginTop : "10px"}}>
                    <h4>{trans?.accountType} Accounts</h4>
                    <div className={Style.AccountAction}>
                        <div className={Style.Column}>
                            <p>{t('Accounts.totalBalance')}</p>
                            <p className={Style.Balance}>{trans?.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD</p>
                        </div>
                        <div className={Style.line}></div>
                        <div className={Style.Column}>
                            <p>{t('Accounts.totalIncome')}</p>
                            <p className={Style.Income}>{income.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD</p>
                        </div>
                        <div className={Style.line}></div>
                        <div className={Style.Column}>
                            <p>{t('Accounts.totalOutcome')}</p>
                            <p className={Style.Outcome}>{outcome.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD</p>
                        </div>
                        <div className={Style.line}></div>
                        <div className={Style.Column}>
                            <p>{t('Accounts.totalTransactions')}</p>
                            <p className={Style.Transaction}>{trans?.transactions?.length}</p>
                        </div>
                    </div>
            </div>
        )
    });

    let accountList = accounts?.length >= 1 ?
    ( 
        accounts.map((account) => {
        return (
            <div className={ account.accountType === 'Savings' ? Style.AccountCardSaving : Style.AccountCard} key={account.accountID}>
                <div className={Style.iconCard}>
                    {account.accountType === 'Savings' ? <HandCoins /> : <CreditCard />}
                </div>
                <div>
                    <h4>{account.accountType} account</h4>
                    <p>{account.accountNumber.match(/.{1,4}/g)?.join(" ")}</p>
                    <div className={Style.AccountInfo}>
                        <div style={ {display: 'flex', flexDirection: 'column', gap: '5px'} }>
                            <p>Balance:</p>
                            <p>{account.accountBalance?.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD</p>
                        </div>
                        <p style={ {fontWeight: 'bold', alignSelf: 'flex-end'} }>{account.accountStatus}</p>
                    </div>
                </div>
            </div>
        )}))
        :    
        (<div className={Style.LottieContainer}>
            <DotLottieReact className={Style.Lottie} src="/Lotties/add.lottie" loop autoplay  /> 
            <p>{t("Accounts.addAccount")}</p>   
        </div>);
    
    return (
        <>
            {addStatus ? (
                <section className={Style.Account}>
                    <div className={Style.AccountHeader}>
                        <div>
                            <h2>{t('Accounts.addTitle')}</h2>
                            <p>{t('Accounts.addDescription')}</p>
                        </div>
                        <div className={Style.AddAccountBtn} onClick={() => setAddStatus(false)}>
                            <Undo2 size={20} color="white" />
                            <p>{t('Accounts.back')}</p>
                        </div>
                    </div>

                    <div className={Style.AccountList}>
                        <AddAccount />
                    </div>
                </section>
            ) : (
                <section className={Style.Account}>
                    <div className={Style.AccountHeader}>
                        <div>
                            <h2>{t('Accounts.title')}</h2>
                            <p>{t('Accounts.description')}</p>
                        </div>
                        <div className={Style.AddAccountBtn} onClick={() => setAddStatus(true)}>
                            <Plus size={20} color="white" />
                            <p>{t('Accounts.add')}</p>
                        </div>
                    </div>
                    
                    <div className={`${accounts.length >= 1 ? Style.AccountList : Style.AccountListTwo}`}>
                        {isLoading ? 
                         <DotLottieReact src="/Lotties/loading.lottie" loop autoplay style={{ width: "100px", height: "100px" }}/>
                            : accountList
                        }
                    </div>

                    <div className={Style.ActionContainer}>
                        <div className={Style.ActionHeader}>
                            <div className={`${Style.colHeader} ${ActionBtn == "Transfer" ? Style.Active : ""}`}
                             onClick={() => setActionBtn("Transfer")}>
                                <CloudSync />
                                <p>{t('Accounts.transfer')}</p>
                            </div>

                            <div className={`${Style.colHeader} ${ActionBtn == "Deposit" ? Style.Active : ""}`}
                             onClick={() => setActionBtn("Deposit")}> 
                                <BanknoteArrowUp />
                                <p>{t('Accounts.deposit')}</p>
                            </div>

                            <div className={`${Style.colHeader} ${ActionBtn == "Withdraw" ? Style.Active : ""}`}
                             onClick={() => setActionBtn("Withdraw")}>
                                <BanknoteArrowDown />
                                <p>{t('Accounts.withdraw')}</p>
                            </div>
                        </div>

                        <div className={Style.ActionBody}>
                            {ActionBtn == "Transfer" ? <Transfer accounts={accounts} setAccounts={setAccounts}/> : 
                            ActionBtn == "Deposit" ? <Deposit accounts={accounts}/> : <Withdraw accounts={accounts}/>} 
                        </div>
                    </div>

                    <div className={Style.AccountSummary}>
                        <h3>{t('Accounts.summary')}</h3>
                        {Transactions}
                    </div>
                </section>
            )}
        </>
    )
}

export default Account;