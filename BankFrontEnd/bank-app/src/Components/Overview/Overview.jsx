import Style from './Overview.module.css';
import { FolderOpen, ChartNoAxesCombined, ArrowRightLeft   } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/functions/ApiFunction';
import { CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { useTranslation } from 'react-i18next';


const Overview = () => {

    const [transAccounts, setTransAccounts] = useState(null);
    const [selected, setSelected] = useState("7D");
    const { t } = useTranslation();

    useEffect(() =>{
        let isMounted = true;

        async function GetAccountsTransaction() {
            try {
                const response = await apiFetch(`https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Transfers/All`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }, localStorage.getItem("Email"));
      
                
                if(response.ok)
                {
                    const data = await response.json();
      
                    if (isMounted) {
                        setTransAccounts(data);
                        console.log(data);
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

    }, []);

    const now = new Date();

    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(now.getDate() - 6);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 29);

    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(now.getDate() - 89);

    const oneEightyDaysAgo = new Date(now);
    oneEightyDaysAgo.setDate(now.getDate() - 179);



    const FilterAccount = transAccounts?.filter((A) => {
        return A.accountType == "Checking";
    })

    
    const ChartDataBalance = FilterAccount?.[0]?.transactions?.map(transaction => ({
        date: transaction?.createdAt,
        balance: transaction?.balanceAfter
    })) ?? [];

    const ChartLastWeek = ChartDataBalance?.filter((x) => {
        const transactionDate = new Date(x.date);
        return transactionDate >= sevenDaysAgo && transactionDate <= now;
    })

    const ChartLastMonth = ChartDataBalance?.filter((x) => {
        const transactionDate = new Date(x.date);
        return transactionDate >= thirtyDaysAgo && transactionDate <= now;
    })

    const Chart3Months = ChartDataBalance?.filter((x) => {
        const transactionDate = new Date(x.date);
        return transactionDate >= ninetyDaysAgo && transactionDate <= now;
    })

     const Chart6Months = ChartDataBalance?.filter((x) => {
        const transactionDate = new Date(x.date);
        return transactionDate >= oneEightyDaysAgo && transactionDate <= now;
    })
    
    

    const ChartDataTransactions = FilterAccount?.[0]?.transactions
        .filter(transaction => {
            const date = new Date(transaction.createdAt);

            return date >= sevenDaysAgo && date <= now;
        })

        .reduce((result, transaction) => {
            const date = new Date(transaction.createdAt).toLocaleDateString();

            const existing = result.find(item => item.date === date);

            if (existing) {
                existing.transactions++;
            } 
            else
            {
                result.push({
                    date,
                    transactions: 1
                });
            }

            return result;
    }, []);



    const transactionsNumber = ChartDataTransactions?.reduce((curr, trans) => {
        return curr += trans.transactions;
    }, 0);

     
    
 
    return (
        <section className={Style.overview}>
            <h2>{t('Overview.title')}</h2>
            <p>{t('Overview.description')}</p>
            
            <div className={Style.firstRow}>

                <div className={Style.chartCardsContainer}>
                    <div className={Style.IconContainer}>
                        <FolderOpen/>
                    </div>

                    <div className={Style.Cardinfo} >
                        <p>{t('Overview.totalBalance')}</p>
                        <h5>{FilterAccount?.[0]?.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD</h5>
                        <p>{t('Overview.lastWeekChart')}</p>
                    </div> 

                    <AreaChart
                        style={{ width: "140px", height: "100px", aspectRatio: 1.618, maxWidth: 600 }}
                        responsive
                        data={ChartLastWeek}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 5,
                            left: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="5 5" hide />

                        <XAxis
                            dataKey="date"
                            tickFormatter={(date) =>
                                new Date(date).toLocaleDateString()
                            }
                            hide
                        />

                        <YAxis hide />

                        <Tooltip 
                            contentStyle={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                color: "#222",
                            }}
                            labelStyle={{
                                color: "#222",
                            }}
                            itemStyle={{
                                color: "#222",
                            }}/>

                        <Area
                            type="monotone"
                            dataKey="balance"
                            name="Balance"
                            stroke="#ffffff"
                            fill="#9bd499"
                        />
                    </AreaChart>
                
                </div> 

                <div className={Style.chartCardsContainerTwo}>
                    <div className={Style.IconContainerTwo}>
                        <ArrowRightLeft/>
                    </div>

                    <div className={Style.Cardinfo} >
                        <p>{t('Overview.totalTransactions')}</p>
                        <h5>{transactionsNumber}</h5>
                        <p>{t('Overview.lastWeekChart')}</p>
                    </div> 

                    <AreaChart
                        style={{ width: "140px", height: "100px", aspectRatio: 1.618, maxWidth: 600 }}
                        responsive
                        data={ChartDataTransactions}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 5,
                            left: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="5 5" hide />

                        <XAxis
                            dataKey="date"
                            tickFormatter={(date) =>
                                new Date(date).toLocaleDateString()
                            }
                            hide
                        />

                        <YAxis hide />

                        <Tooltip 
                            contentStyle={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                color: "#222",
                            }}
                            labelStyle={{
                                color: "#222",
                            }}
                            itemStyle={{
                                color: "#222",
                            }}/>

                        <Area
                            type="monotone"
                            dataKey="transactions"
                            name="transactions"
                            stroke="#ffffff"
                            fill="#84e4d1"
                        />
                    </AreaChart>
                
                </div> 

            </div>

            <div className={Style.secondRow}>
                <div className={Style.secondRowHeader}>
                    <div className={Style.secondRowHeaderInfo}>
                        <div className={Style.secondRowIcon}>
                            <ChartNoAxesCombined/>
                        </div>
                        <div className={Style.secondRowInfo}>
                            <h3>{t('Overview.balanceOverview')}</h3>
                        </div>
                    </div>
                    <div className={Style.secondRowHeaderFilter}>
                        <div className={`${Style.secondRowHeaderFilterItem} ${selected == "7D" ? Style.active : ""}`} onClick={() => setSelected("7D")}>
                            <p>7D</p>
                        </div>
                        <div className={`${Style.secondRowHeaderFilterItem} ${selected == "30D" ? Style.active : ""}`} onClick={() => setSelected("30D")}>
                            <p>30D</p>
                        </div>
                        <div className={`${Style.secondRowHeaderFilterItem} ${selected == "3M" ? Style.active : ""}`} onClick={() => setSelected("3M")}>
                            <p>3M</p>
                        </div>
                        <div className={`${Style.secondRowHeaderFilterItem} ${selected == "6M" ? Style.active : ""}`} onClick={() => setSelected("6M")}>
                            <p>6M</p>
                        </div>
                    </div>
                </div>

                <AreaChart
                    style={{ width: "100%", aspectRatio: 1.618, height: 350}}
                    responsive
                    data={selected == "7D" ? ChartLastWeek :
                        selected == "30D" ? ChartLastMonth :
                        selected == "3M" ? Chart3Months :
                        selected == "6M" ? Chart6Months : ""}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 5,
                        left: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="5 5" />

                    <XAxis
                        dataKey="date"
                        tickFormatter={(date) =>
                            new Date(date).toLocaleDateString()
                        }
                    />

                    <YAxis hide/>

                    <Tooltip />

                    <Area
                        type="monotone"
                        dataKey="balance"
                        name="Balance"
                        stroke="#48be3b"
                        fill="#498f57"
                        fillOpacity={0.2}
                        strokeWidth={2}
                    />
                </AreaChart>               
            </div>

        </section>      
    )
}

export default Overview;