import Style from './MyCard.module.css'
import {CreditCard , Plus , Undo2 } from 'lucide-react';
import Brand from '../Brand/Brand';
import visa from "../../assets/visa.png";
import masterCard from "../../assets/mastercard.png"
import { useState, useEffect } from 'react';
import AddCard from '../AddCards/AddCard';
import { apiFetch } from '../../utils/functions/ApiFunction';
import { useTranslation } from 'react-i18next';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const MyCard = ({customerId}) => {

    const [cards, setCards] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [addCardStatus, setAddCardStatus] = useState(false);
    const [Msg , setMsg] = useState({type : null, msg : null});
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
       
        const fetchCards = async () => {
            setIsLoading(true);
            try {
                const response = await apiFetch(`https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Cards/${customerId}`, {
                 method: 'GET',
                headers: { 
                    'Content-Type': 'application/json' } }, localStorage.getItem("Email"));

                if(response.ok) 
                {
                    const data = await response.json();
                    setCards(data);
                    setIsLoading(false);    
                }

            } catch (error) {
                console.error('Error fetching cards:', error);
                setIsLoading(false); 
            }
        };

        fetchCards();

        return () => {
            setIsLoading(false); 
        }

    }, []);

    useEffect(() => {

        async function GetAccounts() {

            let isMounted = true;

            try {
                const response = await apiFetch(`https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Accounts/${customerId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }, localStorage.getItem("Email"));
    
                
                if(response.ok)
                {
                    const data = await response.json();
    
                    if (isMounted) {
                        setAccounts(data);
                    }
                }

            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        
            return () => {
                isMounted = false;
            };
        }

        GetAccounts();

    }, []);

    // const accountsWithoutCards = accounts?.filter(
    //     account => !cards?.some(
    //         card => card.accountID === account.accountID
    //     )
    // );


    const DisplayCards = cards?.map((card) => {

        const formatted = new Date(card?.expirationDate).toLocaleDateString("en-US", {
            month: "2-digit",
            year: "2-digit"
        });

        return (   
        <div key={card.cardID} className={`${Style.card} ${selectedCard != null && selectedCard.cardID === card.cardID ? Style.selectedCard : ""}`}
         onClick={() => {setSelectedCard(card); setMsg({type : null, msg : null})}}>
            <Brand/>
            <p>{card.cardNumber.match(/.{1,4}/g)?.join(" ")}</p>
            <div>
                <p>{card.cardHolderName}</p>
                <div className={Style.cardFooter}>
                    <p>{formatted}</p>
                    <img src={card?.cardBrand == 'Visa'  ? visa : masterCard} alt="CardType" />
                </div>
            </div>
        </div>
    )});

    const FreezeCard = async () => {

        try {
            const response = await apiFetch(`https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Cards/Freeze/${selectedCard?.cardID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, localStorage.getItem("Email"));

            if(response.ok)
            {
                const frozenCard = { ...selectedCard, status: "Frozen" };
                setSelectedCard(frozenCard);
                setCards((currentCards) => currentCards?.map((card) =>
                    card.cardID === frozenCard.cardID ? frozenCard : card
                ));
                setMsg({type : "success", msg : t("Cards.frozen")})
            }

        } catch (error) {
            console.error('Error fetching accounts:', error);
        }

    }


    return (
        addCardStatus ? (
            <section className={Style.myCard}>
                <div className={Style.myCardsHeader}>
                    <div>
                        <h2>{t('Cards.addTitle')}</h2>
                        <p>{t('Cards.addDescription')}</p>
                    </div>
                    <div className={Style.AddBtn} onClick={() => setAddCardStatus(!addCardStatus)}>
                        <Undo2 size={20} color="white" />
                        <p>{t('Cards.back')}</p>
                    </div>
                </div>
                <AddCard accounts={accounts}/>
            </section>
        ) : (
            <section className={Style.myCard}>
                <div className={Style.myCardsHeader}>
                    <div>
                        <h2>{t('Cards.title')}</h2>
                        <p>{t('Cards.description')}</p>
                    </div>
                    <div className={Style.AddBtn} onClick={() => setAddCardStatus(!addCardStatus)}>
                        <Plus size={20} color="white" />
                        <p>{t('Cards.order')}</p>
                    </div>
                </div>
                <div className={Style.CardContainer}>
                    {isLoading ? 
                        <DotLottieReact src="/Lotties/loading.lottie" loop autoplay style={{ width: "100px", height: "100px" }}/>
                    :
                    cards?.length >= 1 ?  DisplayCards 
                    :
                        (<div className={Style.LottieContainer}>
                                <DotLottieReact className={Style.Lottie} src="/Lotties/add.lottie" loop autoplay  /> 
                                <p>{t("Cards.addCard")}</p>   
                        </div>)
                    }
               </div>
                <div className={Style.SelectedCardContainer}>
                    <h3>{t('Cards.selected')}</h3>
                    <p>{t('Cards.details')}</p>
                    <div>
                        {selectedCard ? (
                            <div className={Style.SelectedCardDetails}>
                                    <p> <span>{t('Cards.number')}</span> {selectedCard?.cardNumber?.match(/.{1,4}/g)?.join(" ")}</p>
                                    <p> <span>{t('Cards.holder')}</span> {selectedCard?.cardHolderName}</p>
                                    <p> <span>{t('Cards.expiration')}</span> {new Date(selectedCard?.expirationDate).toLocaleDateString("en-US", {
                                        dateStyle: 'short',
                                })}</p>
                                    <p> <span>{t('Cards.brand')}</span> {selectedCard?.cardBrand}</p>
                                    <p> <span>{t('Cards.status')}</span> {selectedCard?.status}</p>
                                    <p> <span>{t('Cards.type')}</span> {selectedCard?.cardType}</p>
                                    <p> <span>{t('Cards.accountType')}</span> {selectedCard?.account?.accountType}</p>
                                <div className={Style.FreezeCardBtn} onClick={FreezeCard}>
                                    <CreditCard size={20} color="white" />
                                    <p>{t('Cards.freeze')}</p>
                                </div>
                                {Msg && Msg.type == "success" && <p 
                                style={{color : 'green',
                                        textAlign : "center",
                                        marginTop : "10px",
                                        backgroundColor : "#99eb9194",
                                        padding : "5px"
                                      }}
                                      >{Msg.msg}</p> }
                            </div>
                        ) :  (
                        <div className={Style.LottieContainer}>
                            <DotLottieReact className={Style.Lottie} src="/Lotties/EmptyState.lottie" loop autoplay  /> 
                            <p>{t("Cards.selectCard")}</p>   
                        </div>
                        )}
                    </div>
                </div>
            </section>
        )

    )
}

export default MyCard;