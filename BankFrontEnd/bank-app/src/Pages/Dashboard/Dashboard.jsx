import { useState, useEffect } from 'react';
import Brand from "../../Components/Brand/Brand";
import Style from "./Dashboard.module.css";
import { PanelsTopLeft, CreditCard, ArrowLeftRight ,Cog , ArrowBigDownDash , ContactRound, ArrowBigUpDash , ListSortAscending   } from 'lucide-react';
import Overview from '../../Components/Overview/Overview';
import Transaction from '../../Components/Transactions/Transaction';
import Account from '../../Components/Accounts/Account';
import MyCard from '../../Components/MyCards/MyCard';
import Setting from '../../Components/Settings/Setting';
import Top from '../../Components/Top/Top';
import Money from "../../Assets/money-100.png";
import Robot from "../../Assets/greenRobotCom.png";
import {apiFetch} from "../../utils/functions/ApiFunction";
import { useTranslation } from 'react-i18next';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Dashboard = () => {

    const [activeMenu, setActiveMenu] = useState('overview');
    const [user, setUser] = useState(null);
    const [activeIcon, setActiveIcon] = useState("All");
    const [recentTrans, setRecentTrans] = useState(null);
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);   

    const menuItems = [
        { name: 'overview', icon: PanelsTopLeft, label: t('Dashboard.overview') },
        { name: 'accounts', icon: ContactRound, label: t('Dashboard.accounts') },
        { name: 'cards', icon: CreditCard, label: t('Dashboard.cards') },
        { name: 'transactions', icon: ArrowLeftRight, label: t('Dashboard.transactions') },
        { name: 'settings', icon: Cog, label: t('Dashboard.settings') },
    ];


    useEffect(() => {
        async function GetUser() {

            const response = await apiFetch('https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/user/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }, localStorage.getItem("Email"));

            const userData = await response.json();

            if (response.ok) {
                setUser(userData?.userResponseDTO);
            }
        }

        GetUser();

        return () => {}

    }, []);

    
    useEffect(() => {

        async function getTransaction() {
            try {
                setIsLoading(true)
                const response = await apiFetch(`https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Transfers/Customer/filtred`,
                    {      
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            pageSize: 3
                        })
                    }, user?.emailAddress 
                );

                const data = await response.json() ; 

                if(response.ok) 
                {
                    setRecentTrans(data);
                    setIsLoading(false)
                }

            } catch(err) {
                console.log(err.message);
                setIsLoading(false)
            }
        }


        getTransaction();

        return () => { setIsLoading(false) }
        
    }, []);
    

    const transactionTypes = {
        "Transfer to" : 2,
        "Transfer from" : 3 ,
    }

    async function GetFiltredTransaction(transType = null) 
    {
        const GettransactionType = [];

        if(transType != null)
        {
            GettransactionType.push(transType);
        }
  
        try {
             setIsLoading(true);
            const response = await apiFetch(`https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Transfers/Customer/filtred`,
                {      
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        transType : GettransactionType,
                        pageSize: 3
                    })
                }, user?.emailAddress
            );

            const data = await response.json() ; 

            if(response.ok) 
            {
                setRecentTrans(data);
                setIsLoading(false);
            } 


        } catch(err) {
            console.log(err.message);
            setIsLoading(false);
        }
    }

    const displayRecentTransaction = recentTrans?.transactions?.map((x) => {
        const shortDate = new Date(x?.createdAt).toLocaleString('en-US', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
        return(
            <div key={x?.transactionID} className={Style.TransactionContainer}>
                <div style={{display : 'flex', gap : "10px", alignItems : "center"}}>
                    <img src={Money} alt="UserAvatar" />
                    <div className={Style.TransactionInfo}>
                        <p>{x?.relatedAccount != null ? x?.relatedAccount?.customer?.firstName + " " + x?.relatedAccount?.customer?.lastName : "AbdoBank"}</p>
                        <p>{shortDate}</p>
                    </div>
                </div>
                <p className={x?.transactionType == "transferTo" || x?.transactionType == "withdraw" ? Style.Outcome : Style.Income}>{x?.transactionType == "transferTo"  || x?.transactionType == "withdraw" ? "-" + x?.amount : "+" + x?.amount} MAD</p>
            </div>
        )
    })
    

    return (
        <>
            <Top/>
            <section className={Style.Dashboard}>
                <div className={Style.SideMenu}>
                    <Brand/>
                    <ul>
                        {menuItems.map((item) => (
                            <div 
                                key={item.name}
                                className={`${Style.SideMenuItem} ${activeMenu === item.name ? Style.Active : ''}`}
                                name={item.name}
                                onClick={() => setActiveMenu(item.name)}
                            >
                                <item.icon size={20} color={activeMenu === item.name ? " rgb(158, 192, 74)" : "grey"} />
                                <li>{item.label}</li>
                            </div>
                        ))}
                    </ul>
                    <div className={Style.bottom}>
                        <div className={Style.SideMenuButtomItem}>  
                        </div>
                        <img src={Robot} alt="RobotImage" />
                    </div>
                </div>

                <div className={Style.Content}>
                    {activeMenu === 'overview' && <Overview />}
                    {activeMenu === 'accounts' && <Account UserInfo={user} />}
                    {activeMenu === 'cards' && <MyCard customerId={user?.customerID} />}
                    {activeMenu === 'transactions' && <Transaction />}
                    {activeMenu === 'settings' && <Setting UserInfo={user} setUserInfo={setUser}/>}
                </div>

                <div>
                    <div className={Style.RepresentUser}>
                        <div className={Style.UserAvatar}>
                            <img src={Money} alt="UserAvatar" />
                        </div>
                        <p>{t('Dashboard.welcome')}</p>
                        <p style={{ fontWeight: 'bold', color: 'black' }}>{user?.customer?.firstName} {user?.customer?.lastName}</p>
                        <div className={Style.sideBarFooter}>
                            <div className={Style.iconFilter}>
                                <div className={`${Style.iconContainer} ${activeIcon == "Send" ? Style.iconActive : ""}`}>
                                    <ArrowBigUpDash className={Style.icon} onClick={() => { setActiveIcon("Send"); GetFiltredTransaction(transactionTypes["Transfer to"])}}/>
                                    <p>{t('Dashboard.send')}</p>
                                </div>
                                <div className={`${Style.iconContainer} ${activeIcon == "Recieve" ? Style.iconActive : ""}`}>
                                    <ArrowBigDownDash className={Style.icon} onClick={() => { setActiveIcon("Recieve"); GetFiltredTransaction(transactionTypes["Transfer from"])}}/>
                                    <p>{t('Dashboard.receive')}</p>
                                </div>
                                <div className={`${Style.iconContainer} ${activeIcon == "All" ? Style.iconActive : ""}`}>
                                    <ListSortAscending  className={Style.icon} onClick={() => { setActiveIcon("All") ; GetFiltredTransaction()}}/>
                                    <p>{t('Dashboard.all')}</p>
                                </div>
                            </div>

                            <div className={Style.displayTransactions}>
                                <h3>{t('Dashboard.recentActivity')}</h3>
                                
                                    {isLoading == false &&
                                        displayRecentTransaction}
                                
                            </div>
                            <div style={{display : "flex", alignItems : "center", justifyContent : "center", width : "100%"}}>
                                {isLoading && <DotLottieReact src="/Lotties/loading.lottie" loop autoplay style={{ width: "100px", height: "100px"}}/>}
                            </div>

                        </div>

                    </div>

                </div>
            </section>
        </>
    )
}


export default Dashboard;