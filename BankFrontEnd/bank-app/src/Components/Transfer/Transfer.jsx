import Style from "./Transfer.module.css";
import { useEffect, useState } from "react";
import { MoveRight, CreditCard, HandCoins, CloudBackup  } from 'lucide-react';
import { apiFetch } from "../../utils/functions/ApiFunction";
import { useTranslation } from "react-i18next";

const Transfer = ({accounts, setAccounts}) => {
    const { t } = useTranslation();
    const [type, setType] = useState("myAccounts");
    const [value, setValue] = useState({fromAccount : "", toAccount : "", amount : ""});
    const [Message, setMessage] = useState({type : null, msg: null});

    const handelRotate = () => {
        setAccounts((previousAccounts) => {
            if (previousAccounts.length < 2) return previousAccounts;

            const nextAccounts = [...previousAccounts];
            [nextAccounts[0], nextAccounts[1]] = [nextAccounts[1], nextAccounts[0]];
            return nextAccounts;
        });
    }
    
    useEffect(() => {

        if(type == "myAccounts")
        {
            setValue({...value, fromAccount : accounts[0]?.accountNumber, toAccount : accounts[1]?.accountNumber})
        }

    }, [accounts])


    const handelTransfer = async () => {

        setMessage({type : null, msg: null});
        
        if(value.fromAccount != "" && value.toAccount != "" && value.amount != "")
        {
            try
            {
                const response = await apiFetch(`https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Transfers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body : JSON.stringify(value)
                }, localStorage.getItem("Email"));

                 const msg = await response.text();

                if(response.ok)
                {
                    setMessage({type : "success", msg: msg});
                }   
                else
                    setMessage({type : "failed", msg: msg});  

            } catch(e)
            {
                console.log(e)
            }
        }
        else
            console.log("error fields empty");
            
     
    }

    return(
        <>
            <div className={Style.ActionBodyHeader}>
                <div className={Style.ActionBodyHeaderInfo}> 
                    <h3>{t("Actions.transferMoney")}</h3>
                    <p>{t("Actions.transferDescription")}</p>
                </div>
                <div className={Style.ActionBodyHeaderBtn}>
                    <button className={`${ type == "myAccounts" ? Style.ActionBtn : ""}`} onClick={() => {
                            setType("myAccounts");
                            setValue({fromAccount : "", toAccount : "", amount : ""});
                        }}>
                        {t("Actions.betweenAccounts")}
                    </button>
                    <button className={`${ type == "anotherAccounts" ? Style.ActionBtn : ""}`} onClick={() => {
                            setType("anotherAccounts");
                            setValue({fromAccount : "", toAccount : "", amount : ""});
                        }}>
                        {t("Actions.anotherAccount")}
                    </button>
                </div>
            </div>


            {type == "myAccounts" ?
                <div>
                    <div className={Style.ActionBodyMyAcc}>
                        <div className={Style.AccountBox}>
                            <h4>{t("Actions.fromAccount")}</h4>
                            <div className={Style.AccountBoxContent}>
                                <div className={Style.AccountBoxIcon}>
                                    {accounts[0]?.accountType == "Checking" ? <CreditCard /> : <HandCoins />}
                                </div>
                                <div className={Style.AccountBoxInfo}>
                                    <h4>{accounts[0]?.accountType == "Checking" ? t("Actions.checking") : t("Actions.saving")}</h4>
                                    <p>{accounts[0]?.accountNumber.match(/.{1,4}/g)?.join(" ")} °
                                        {accounts[0]?.accountBalance?.toLocaleString('fr-FR',
                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD</p>
                                </div> 
                            </div>
                        </div>

                        <div className={Style.AccountRotates} onClick={handelRotate}>
                            <CloudBackup />                    
                        </div>

                        <div className={Style.AccountBox}>
                            <h4>{t("Actions.toAccount")}</h4>
                            <div className={Style.AccountBoxContent}>
                                <div className={Style.AccountBoxIcon}>
                                    {accounts[1]?.accountType == "Checking" ? <CreditCard /> : <HandCoins />}
                                </div>
                                <div className={Style.AccountBoxInfo}>
                                    <h4>{accounts[1]?.accountType == "Checking" ? t("Actions.checking") : t("Actions.saving")}</h4>
                                    <p>{accounts[1]?.accountNumber.match(/.{1,4}/g)?.join(" ")} °
                                        {accounts[1]?.accountBalance?.toLocaleString('fr-FR',
                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD</p>
                                </div> 
                            </div>
                        </div>
                    </div>

                    <div className={Style.AccountBoxAmount}>
                         <h4>{t("Actions.amount")}</h4>
                        <input
                           type="text"
                           inputMode="numeric"
                           pattern="[0-9]*"
                           placeholder={t("Actions.enterAmount")}
                           value={value.amount}
                           onChange={(event) => setValue({...value, amount : event.target.value.replace(/\D/g, "")})}
                        />             
                    </div>

                </div>
                
                :

                <div className={Style.sectionTwo}>
                    <div className={Style.ActionToOtherAccount1}>
                        <h4>{t("Actions.fromAccount")}</h4>
                        <p>{t("Actions.selectAccount")}</p>
                        <div className={Style.SelectAccountsContainer}>
                            <div className={`${Style.AccountBoxContent} ${value.fromAccount == accounts[0]?.accountNumber ? Style.selected : ""}`} onClick={()=> {
                                setValue({...value, fromAccount : accounts[0]?.accountNumber})
                            }}>
                                <div className={Style.AccountBoxIcon}>
                                    {accounts[0]?.accountType == "Checking" ? <CreditCard /> : <HandCoins />}
                                </div>
                                <div className={Style.AccountBoxInfo}>
                                    <h4>{accounts[0]?.accountType == "Checking" ? t("Actions.checking") : t("Actions.saving")}</h4>
                                    <p>{accounts[0]?.accountNumber.match(/.{1,4}/g)?.join(" ")} °
                                        {accounts[0]?.accountBalance?.toLocaleString('fr-FR',
                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD</p>
                                </div> 
                            </div>   
                            <div className={`${Style.AccountBoxContent} ${value.fromAccount == accounts[1]?.accountNumber ? Style.selected : ""}`}  onClick={()=> {
                                setValue({...value, fromAccount : accounts[1]?.accountNumber})
                            }}>
                                <div className={Style.AccountBoxIcon}>
                                    {accounts[1]?.accountType == "Checking" ? <CreditCard /> : <HandCoins />}
                                </div>
                                <div className={Style.AccountBoxInfo}>
                                    <h4>{accounts[1]?.accountType == "Checking" ? t("Actions.checking") : t("Actions.saving")}</h4>
                                    <p>{accounts[1]?.accountNumber.match(/.{1,4}/g)?.join(" ")} °
                                        {accounts[1]?.accountBalance?.toLocaleString('fr-FR',
                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD</p>
                                </div> 
                            </div>                    
                        </div>
                    </div>

                    <div className={Style.ActionToOtherAccount2}>
                        <h4>{t("Actions.toAccount")}</h4>
                        <p>{t("Actions.receiverAccount")}</p>
                        <div className={Style.AccountNumberField}>
                            <CreditCard />
                            <input type="text" placeholder={t("Actions.accountNumber")} inputMode="numeric"
                                value={value.toAccount}
                                pattern="[0-9]*"
                                maxLength={16}
                                onChange={(event) => setValue({...value, toAccount : event.target.value.replace(/\D/g, "")})}/>
                        </div>
                    </div>

                    <div className={Style.AccountBoxAmount}>
                         <h4>{t("Actions.amount")}</h4>
                        <input
                           type="text"
                           inputMode="numeric"
                           pattern="[0-9]*"
                           placeholder={t("Actions.enterAmount")}
                           value={value.amount}
                           onChange={(event) => setValue({...value, amount : event.target.value.replace(/\D/g, "")})}
                        />             
                    </div>


                </div>
            }

            {Message.type && <p style={{
                    color : Message.type == "success" ? "green" : "red",
                    marginTop : "10px"
                }}>{Message.msg}</p> }
            <button className={Style.TransferBTN} onClick={handelTransfer}>
                <MoveRight />
                <p>{t("Actions.transfer")}</p>
            </button>
           
        </>
    )
}

export default Transfer;