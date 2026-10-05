import { HandCoins, BanknoteArrowDown, Circle, CircleCheck, Plus } from 'lucide-react';
import Style from "./AddAccount.module.css";
import { useState } from 'react';
import { apiFetch } from '../../utils/functions/ApiFunction';
import { useTranslation } from 'react-i18next';


const AddAccount = () => {
    const [AccountType, setAccountType] = useState(null);
    const [customError, setcustomError] = useState({status : false, msg: ""});
    const [response, setResponse] = useState({status : false, msg: ""});
    const { t } = useTranslation();

    const submitAddAccount = async () => {

        setResponse({status : false, msg : ""});
        setcustomError({status : false, msg: ""})

        if(AccountType == null)
        {
            setcustomError({status : true, msg : t('Actions.selectAccountError')});
            return
        } else
            setcustomError({status : false, msg : ""});

         try {
            const response = await apiFetch(`https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Accounts/Add`,
                {      
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: AccountType == "Checking" ? 0 : 1
                },
                localStorage.getItem("Email")
            );

            const data = await response.text() ; 

            if(response.ok) 
            {
                setResponse({status : true, msg : data});
            }
            else
            {
                setcustomError({status : true, msg: data});
            }


        } catch(err) {
            console.log(err.message);
        }
    }

    return (
        <>
            <div className={Style.parent}>
                <header className={Style.header}>
                    <div className={`${Style.AccountBox} ${AccountType == "Checking" ? Style.border : ""}`} onClick={()=> setAccountType("Checking")}>
                        <div className={Style.AccountTitle}>
                            <BanknoteArrowDown size={40} />
                            <p>{t('Actions.checking')}</p>
                        </div>
                        {AccountType == "Checking" ? <CircleCheck className={Style.CheckIcon}/> : <Circle className={Style.CheckIcon}/>} 
                    </div>
                    <div className={`${Style.AccountBox} ${AccountType == "Saving" ? Style.border : ""}`} onClick={()=> setAccountType("Saving")}>
                        <div className={Style.AccountTitle}>
                            <HandCoins size={40}  />
                            <p>{t('Actions.saving')}</p>
                        </div>
                        {AccountType == "Saving" ? <CircleCheck className={Style.CheckIcon}/> : <Circle className={Style.CheckIcon}/>} 
                    </div>
                </header>

                <div className={Style.Information}>
                    <h3>{t('Actions.initialDeposit')}</h3>
                    <p>0.00 MAD</p>
                    <p>{t('Actions.fundLater')}</p>
                </div>

                <div className={Style.Footer} onClick={submitAddAccount}>
                    <Plus/>
                    <p>{t('Actions.createAccount')}</p>
                </div>
                
               <p style={{marginTop: "10px", color: "red"}}>{customError.status == true ? customError.msg : "" }</p>
               <p style={{marginTop: "10px", color: "green"}}>{response.status == true ? response.msg : "" }</p>
            </div>
        </>
    )
}



export default AddAccount;