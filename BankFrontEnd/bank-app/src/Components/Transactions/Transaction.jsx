import Style from "./Transaction.module.css";
import { useEffect, useReducer } from "react";
import MyCustomSelect from "../CustomSelect/MyCustomSelect.jsx";
import { apiFetch } from "../../utils/functions/ApiFunction";
import { useTranslation } from 'react-i18next';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { initialState, TransactionsReducer } from "../../reduces/transactionsReducres";
import { StepForward , StepBack  } from 'lucide-react';

const Transaction = () => {

    const [state, dispatch] = useReducer(TransactionsReducer, initialState);

    const { t } = useTranslation();

    const TodayDate = new Date();

    const last7Days = new Date(TodayDate);
    last7Days.setDate(TodayDate.getDate() - 7);

    const last30Days = new Date(TodayDate);
    last30Days.setDate(TodayDate.getDate() - 30);
      

    useEffect(() => {

        async function getTransaction() {
            try {
                dispatch({ type: 'SET_LOADING', isLoading: true });
                const response = await apiFetch(
                    state.isFiltered
                        ? `https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Transfers/Customer/filtred`
                        : `https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Transfers/Customer/${state.selectedPage}`,
                    state.isFiltered
                        ? {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                transType: state.filterData["Transaction Type"],
                                accountType: state.filterData["Account Type"],
                                status: state.filterData["Status"],
                                fromDate: state.filterData["Date"],
                                pageNumber: state.selectedPage
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
                    dispatch({ type: 'SET_TRANSACTIONS', data });
                }
                else
                {
                    dispatch({type: 'SET_LOADING', isLoading: false});
                }

            } catch(err) {
                console.log(err.message);
                dispatch({ type: 'SET_LOADING', isLoading: false });

            }
        }

        getTransaction();
        
    }, [state.selectedPage, state.isFiltered, state.filterRequest]);


    const DisplayTransaction = state.transactions?.transactions.map((trans) => {

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
        dispatch({ type: 'SET_PAGE', page: state.selectedPage + 1 });
    }

    function PrevButton()
    {
        dispatch({ type: 'SET_PAGE', page: state.selectedPage - 1 });
    }

    function getFiltredTransaction() {
        dispatch({ type: 'FLITER_REQUEST' });
    }

    function handelIndecator(pageNumber) {

        if(pageNumber === '...' || pageNumber === state.selectedPage) {
            return;
        }

        dispatch({ type: 'SET_PAGE', page: pageNumber });
    }

    const GetPagesFormat = () => {

        if(state.pagesNumber <= 5) {
            return Array.from({ length: state.pagesNumber }, (_, index) => index + 1);
        }


        if(state.selectedPage <= 3) {
            return [1, 2, 3, 4, '...', state.pagesNumber];
        }

        if(state.selectedPage >= state.pagesNumber - 2) {
            return [1, '...', state.pagesNumber - 3, state.pagesNumber - 2, state.pagesNumber - 1, state.pagesNumber];
        }

        return [1, '...', state.selectedPage - 1, state.selectedPage, state.selectedPage + 1, '...', state.pagesNumber];
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
                        <p className={Style.Transaction}>{state.transactions?.totalCount}</p>
                    </div>
                    <div className={Style.line}></div>
                    <div className={Style.Column}>
                        <p>{t('Transactions.income')}</p>
                        <p className={Style.Income}>{state.transactions?.totalIncome} MAD</p>
                    </div>
                    <div className={Style.line}></div>
                    <div className={Style.Column}>
                        <p>{t('Transactions.expense')}</p>
                        <p className={Style.Outcome}>{state.transactions?.totalExpense} MAD</p>
                    </div>
                </div>
            </div>


            <div className={Style.FilterContainer}>
                <div className={Style.Selectsfilter}>
                    <MyCustomSelect label={"Account Type"} options={AccountTypes}  setData={(update) =>dispatch({ type: "UPDATE_FILTER", update })} mode={"single"}/>
                    <MyCustomSelect label={"Transaction Type"} options={transactionTypes}  setData={(update) => dispatch({ type: "UPDATE_FILTER", update })} mode={"multiple"}/>
                    <MyCustomSelect label={"Status"} options={transactionStatus}  setData={(update) => dispatch({ type: "UPDATE_FILTER", update })} mode={"single"}/>
                    <MyCustomSelect label={"Date"} options={transactionDate} setData={(update) => dispatch({ type: "UPDATE_FILTER", update })} mode={"single"}/>
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
                        {state.isLoading == false && DisplayTransaction}
                    </tbody>
                </table>
            </div>

            <div style={{display : "flex", alignItems : "center", justifyContent : "center", width : "100%"}}>
                {state.isLoading && <DotLottieReact src="/Lotties/loading.lottie" loop autoplay style={{ width: "100px", height: "100px"}}/>}
            </div>


            <div className={Style.TransFooter}>

                <button data-testid="previous-button" disabled={state.selectedPage <= 1}  className={Style.BtnPre} onClick={PrevButton}><StepBack /></button>

                <div className={Style.PageNumbers}>
                    {GetPagesFormat().map((page, index) => (
                        <button key={index} data-testid={state.selectedPage == page ? "page-indicator" : undefined} className={`${Style.PageNumber} ${state.selectedPage == page ?  Style.Active : ""}`}
                        onClick ={() => handelIndecator(page)}>
                            {page}
                        </button>
                    ))}
                </div>

                <button data-testid="next-button" disabled={state.selectedPage >= state.pagesNumber} className={Style.BtnNext} onClick={NextButton}><StepForward /></button>

            </div>

        </section>
    )
}

export default Transaction;