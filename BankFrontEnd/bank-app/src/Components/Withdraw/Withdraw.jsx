import Style from "./Withdraw.module.css";
import SelectAccounts from "../SelectAccounts/SelectAccounts";
import {useState} from "react";
import { CreditCard, CalendarFold, User, BanknoteArrowDown } from "lucide-react";
import visa from '../../assets/visa.png';
import mastercard from '../../assets/mastercard.png';
import { apiFetch } from "../../utils/functions/ApiFunction";
import { useTranslation } from "react-i18next";

const Withdraw = ({accounts}) => 
{
    const { t } = useTranslation();
    const [selectAccountNumber, setSelectAccountNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [cardInfo, setCardInfo] = useState({cardNum: "", Expiration: "", cvc: "", name: ""});
    const [Message, setMessage] = useState({type : null, msg: null});

    const handelAction = async () => {
        
        setMessage({type : null, msg: null});

        if (selectAccountNumber !== "" && amount !== "" && cardInfo.Expiration !== "" &&
            cardInfo.cardNum !== "" && cardInfo.cvc !== "" && cardInfo.name !== "")
        {
            try {
                const response = await apiFetch(`https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Transfers/Withdraw`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        accountNumber: selectAccountNumber,
                        amount: amount
                    })
                }, localStorage.getItem("Email"));

                const msg = await response.text();

                if(response.ok)
                {
                    setMessage({type : "success", msg: msg})
                }   
                else
                    setMessage({type : "failed", msg: msg})     
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            console.log("error fields empty");
        }
    };

    return (
        <div className={Style.WithdrawContainer}>
            <h3>{t("Actions.withdraw")}</h3>
            <p>{t("Actions.withdrawDescription")}</p>
            <div className={Style.SelectAccount}>
                <h4>{t("Actions.selectAccount")}</h4>
                <SelectAccounts
                    accounts={accounts}
                    selectAccountNumber={selectAccountNumber}
                    setSelectAccountNumber={setSelectAccountNumber}
                />
            </div>
            <div className={Style.AccountBoxAmount}>
                <h4>{t("Actions.amount")}</h4>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={t("Actions.enterAmount")}
                    value={amount}
                    onChange={(event) => setAmount(event.target.value.replace(/\D/g, ""))}
                />
            </div>
            <div className={Style.paimentMethodContainer}>
                <h4>{t("Actions.paymentMethod")}</h4>
                <p style={{marginTop: "5px"}}>{t("Actions.cardPayment")}</p>
                <div className={Style.cardDetails}>
                    <div className={Style.RowOne}>
                        <div className={Style.RowOneContent}>
                            <CreditCard />
                            <div className={Style.RowOneInfo}>
                                <h5>{t("Actions.cardNumber")}</h5>
                                <input
                                    type="text"
                                    placeholder={t("Actions.cardNumberPlaceholder")}
                                    value={cardInfo.cardNum}
                                    pattern="[0-9]*"
                                    maxLength={16}
                                    onChange={(event) => setCardInfo({...cardInfo, cardNum: event.target.value.replace(/\D/g, "")})}
                                />
                            </div>
                        </div>
                        <div className={Style.RowOneImages}>
                            <img src={visa} alt="visa" />
                            <img src={mastercard} alt="mastercard" />
                        </div>
                    </div>

                    <div className={Style.RowTwo}>
                        <div className={Style.RowTwoDate}>
                            <CalendarFold />
                            <div>
                                <h5>{t("Actions.expiration")}</h5>
                                <input
                                    type="text"
                                    placeholder="MM / YY"
                                    value={cardInfo.Expiration}
                                    maxLength={7}
                                    onChange={(event) => {
                                        let value = event.target.value.replace(/\D/g, "");
                                        if (value.length > 2) value = `${value.slice(0, 2)} / ${value.slice(2, 4)}`;
                                        setCardInfo({...cardInfo, Expiration: value});
                                    }}
                                />
                            </div>
                        </div>
                        <div className={Style.RowTwoCVC}>
                            <h5>CVC</h5>
                            <input
                                type="text"
                                placeholder="123"
                                minLength={3}
                                maxLength={3}
                                value={cardInfo.cvc}
                                onChange={(event) => setCardInfo({...cardInfo, cvc: event.target.value.replace(/\D/g, "")})}
                            />
                        </div>
                    </div>

                    <div className={Style.RowThree}>
                        <User />
                        <div>
                            <h5>{t("Actions.cardholder")}</h5>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={cardInfo.name}
                                onChange={(event) => setCardInfo({...cardInfo, name: event.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {Message.type && <p style={{
                    color : Message.type == "success" ? "green" : "red",
                    marginTop : "10px"
                }}>{Message.msg}</p> }

                <button className={Style.BTNWithdraw} onClick={handelAction}>
                    <BanknoteArrowDown />
                    <p>{t("Actions.withdraw")}</p>
                </button>
            </div>
        </div>
    )
}

export default Withdraw;