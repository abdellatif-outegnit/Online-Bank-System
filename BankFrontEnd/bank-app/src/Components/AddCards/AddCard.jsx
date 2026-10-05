import Style from './AddCard.module.css';
import mastercard from "../../Assets/mastercardPNG.png";
import visa from "../../Assets/visaPNG.png";
import MyCustomSelect from "../CustomSelect/MyCustomSelect.jsx";
import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { apiFetch } from '../../utils/functions/ApiFunction';


const AddCard = ({ accounts }) => {

    const [myAccountId, setMyAccountId] = useState({"Account Number" : null});
    const [CardType, setCardType] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [error, setError] = useState({status : false, msg : ""});
    const [Response, setResponse] = useState({status : false, msg : ""});
    
    const AccountOptions = accounts?.reduce((acc, account) => {

        const key = account.accountID;
        if (key) acc[key] = account.accountNumber.match(/.{1,4}/g)?.join(" ");
        return acc;

    }, {});
    console.log(AccountOptions);
    

    const AddCard = async () => {
        if(myAccountId["Account Number"] == null || CardType == null || selectedBrand == null )
        {
            setError({status : true , msg : "Lack of data!"})
        }

        try {
            const response = await apiFetch(`https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Cards/Add`,
                {      
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            accountID: myAccountId["Account Number"],
                            cardType: CardType == "Debit" ? 0 : CardType == "Credit" ? 1 : null,
                            cardBrand: selectedBrand == "Visa" ? 0 : selectedBrand == "Mastercard" ? 1 : null
                        }
                    )
                }, localStorage.getItem("Email")
            );

            const data = await response.text() ; 

            if(response.ok) 
            {
                setResponse({status : true, msg : data});
                setError({status : false , msg : ""})
            }

        } catch(err) {
            console.log(err.message);
        }
    }


    
    return (
        <section className={Style.addCardContainer}>
            <h3>Choose a Card Brand</h3>
            <div className={Style.CardBrand}>
                <div className={`${Style.CardBrandBox} ${selectedBrand === "Visa" ? Style.selected : ""}`} onClick={() => setSelectedBrand("Visa")}>
                    <img src={visa} alt="Visa" />
                    <h3>Visa</h3>
                </div>
                <div className={`${Style.CardBrandBox} ${selectedBrand === "Mastercard" ? Style.selected : ""}`} onClick={() => setSelectedBrand("Mastercard")}>
                    <img src={mastercard} alt="Mastercard" />
                    <h3>Mastercard</h3>
                </div>
            </div>
            <h3>Linked Account</h3>
            <MyCustomSelect label={"Account Number"} options={AccountOptions} setData={setMyAccountId} mode={"single"} />

            <h3>Card Type</h3>
            <div className={Style.CardType}>
                <input type="radio" name="cardType" value="Debit" onChange={() => setCardType("Debit")} />
                <label htmlFor="debit">Debit</label>
            </div>

            <div className={Style.CardType}>
                <input type="radio" name="cardType" value="Credit" onChange={() => setCardType("Credit")} />
                <label htmlFor="credit">Credit</label>
            </div>

            <div className={Style.BtnContainer}>
                <div className={Style.CardBtn} onClick={AddCard}>
                    <CreditCard size={20} color="white" />
                    <p>Order Card </p>
                </div>
            </div>

            {Response.status && <p style={{color : "green"}}>{Response.msg}</p> }
            {error.status && <p style={{color : "red"}}>{error.msg}</p> }
            
        </section>
    )
}

export default AddCard;