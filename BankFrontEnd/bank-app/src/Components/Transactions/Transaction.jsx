import Style from "./Transaction.module.css";
import { useState, useEffect } from "react";
import MyCustomSelect from "../CustomSelect/MyCustomSelect.jsx";
import { apiFetch } from "../../utils/functions/ApiFunction";
import { useTranslation } from 'react-i18next';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Transaction = () => {

    const [transactions , setTtransaction ] = useState(null);
    const [pagesNumber , setPagesNumber] = useState(0);
    const [selectedPage, setSelectedPage] = useState(1);
    const [filterData , setFilterData] = useState({
        "Account Type" : null,
        "Status" : null,
        "Transaction Type" : [],
        "Date" : null
    });
    const [isFiltered, setIsFiltered] = useState(false);
    const [filterRequest, setFilterRequest] = useState(0);
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);   

    const TodayDate = new Date();

    const last7Days = new Date(TodayDate);
    last7Days.setDate(TodayDate.getDate() - 7);

    const last30Days = new Date(TodayDate);
    last30Days.setDate(TodayDate.getDate() - 30);
      

    useEffect(() => {

        async function getTransaction() {
            try {
                setIsLoading(true);
                const response = await apiFetch(
                    isFiltered
                        ? `https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Transfers/Customer/filtred`
                        : `https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Transfers/Customer/${selectedPage}`,
                    isFiltered
                        ? {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                transType: filterData["Transaction Type"],
                                accountType: filterData["Account Type"],
                                status: filterData["Status"],
                                fromDate: filterData["Date"],
                                pageNumber: selectedPage
                            })
                        }
                        : {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                , localStorage.getItem("Email"));

                const data = await response.json() ; 

                if(response.ok) 
                {
                    setTtransaction(data);
                    setPagesNumber(data?.pagesNumber);
                    setIsLoading(false);
                }

            } catch(err) {
                console.log(err.message);
                setIsLoading(false);

            }
        }


        getTransaction();

        return () => { setIsLoading(false); }
        
    }, [selectedPage, isFiltered, filterRequest]);


    const DisplayTransaction = transactions?.transactions.map((trans) => {

       const shortDate = new Date(trans?.createdAt).toLocaleString('en-US', {
            dateStyle: 'short',
            timeStyle: 'short'
        });

        return (
            <tr key={trans?.transactionID}>
                <td>{shortDate}</td>
                <td>{trans?.transactionType}</td>
                <td>{trans?.account?.accountType} Account</td>
                <td className={trans?.transactionType == "transferTo" || trans?.transactionType == "withdraw"  ? Style.Outcome : Style.Income}>{trans?.transactionType == "transferTo" || trans?.transactionType == "withdraw" ? "-" + trans?.amount : "+" + trans?.amount} MAD</td>
                <td className={trans?.status == "completed" ? Style.Income : Style.Transaction}>{trans?.status}</td>
            </tr>
        )
    })

    function NextButton()
    {
        setSelectedPage(currentPage => currentPage + 1);
    }

    function PrevButton()
    {
        setSelectedPage(currentPage => currentPage - 1);
    }

    function getFiltredTransaction() {
        setSelectedPage(1);
        setIsFiltered(true);
        setFilterRequest(currentRequest => currentRequest + 1);
    }


    const AccountTypes = {
        0 : "Checking account",
        1 : "Saving account",
        2 : "All accounts"
    }

    const transactionStatus = {
        0 : "Completed",
        1 : "Reversed",
        2 : "All status"
    }

    const transactionTypes = {
        0 : "Deposit",
        1 : "Withdraw",
        2 : "Transfer to",
        3 : "Transfer from" ,
        4 : "All types"
    }

    const transactionDate = {
        [TodayDate.toISOString()] : "Today",
        [last7Days.toISOString()] : "Last 7 days",
        [last30Days.toISOString()] : "Last 30 days",
        3 : "All days"
    }

    return (

        <section className={Style.transaction}>
            <div>
                <h2>{t('Transactions.title')}</h2>
            </div>

            <div style={{marginTop : "10px"}}>
                <div className={Style.transHeader}>
                    <div className={Style.Column}>
                        <p>{t('Transactions.total')}</p>
                        <p className={Style.Transaction}>{transactions?.totalCount}</p>
                    </div>
                    <div className={Style.line}></div>
                    <div className={Style.Column}>
                        <p>{t('Transactions.income')}</p>
                        <p className={Style.Income}>{transactions?.totalIncome} MAD</p>
                    </div>
                    <div className={Style.line}></div>
                    <div className={Style.Column}>
                        <p>{t('Transactions.expense')}</p>
                        <p className={Style.Outcome}>{transactions?.totalExpense} MAD</p>
                    </div>
                </div>
            </div>


            <div className={Style.FilterContainer}>
                <div className={Style.Selectsfilter}>
                    <MyCustomSelect label={"Account Type"} options={AccountTypes}  setData={setFilterData} mode={"single"}/>
                    <MyCustomSelect label={"Transaction Type"} options={transactionTypes}  setData={setFilterData} mode={"multiple"}/>
                    <MyCustomSelect label={"Status"} options={transactionStatus}  setData={setFilterData} mode={"single"}/>
                    <MyCustomSelect label={"Date"} options={transactionDate} setData={setFilterData} mode={"single"}/>
                </div>
                <button className={Style.filterBTN} onClick={getFiltredTransaction}>{t('Transactions.view')}</button>
            </div>


            <div className={Style.TransactionList}>
                <table>
                    <thead>
                        <tr>
                            <th>{t('Transactions.date')}</th>
                            <th>{t('Transactions.type')}</th>
                            <th>{t('Transactions.accountType')}</th>
                            <th>{t('Transactions.amount')}</th>
                            <th>{t('Transactions.status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading == false && DisplayTransaction}
                    </tbody>
                </table>
            </div>

            <div style={{display : "flex", alignItems : "center", justifyContent : "center", width : "100%"}}>
                {isLoading && <DotLottieReact src="/Lotties/loading.lottie" loop autoplay style={{ width: "100px", height: "100px"}}/>}
            </div>


            <div className={Style.TransFooter}>

                <button disabled={selectedPage <= 1}  className={Style.BtnPre} onClick={PrevButton}>{t('Transactions.previous')}</button>

                <div className={Style.PageNumbers}>
                    {Array.from({ length: pagesNumber }, (_, index) => (
                        <button key={index + 1} className={`${Style.PageNumber} ${selectedPage == (index + 1) ?  Style.Active : ""}`}>
                            {index + 1}
                        </button>
                    ))}
                </div>

                <button disabled={selectedPage >= pagesNumber} className={Style.BtnNext} onClick={NextButton}>{t('Transactions.next')}</button>

            </div>

        </section>
    )
}

export default Transaction;