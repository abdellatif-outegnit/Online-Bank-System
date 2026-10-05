import userAuth from "../../assets/userAuth.svg"
import passwordAuth from "../../assets/passwordAuth.svg"
import Style from "./Authentication.module.css"
import { useForm} from "react-hook-form"
import { EyeClosed, Eye  } from 'lucide-react';
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from "react-router";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';



export default function Authentication()
{
    const { t, i18n } = useTranslation();
    const [ShowPassword, SetShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm()

    const nav = useNavigate()

    const onSubmit = async (data) => {

        setIsLoading(true);

        try {
            var postData = await fetch("https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Auth/login", {
                method : "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body : JSON.stringify({
                    emailAddress : data.EmailRequired,
                    password : data.passwordRequired
                })
            });

             if (postData.ok) {
                const dataResponse = await postData.json();
        
                localStorage.setItem("AccessToken", dataResponse.accessToken);
                localStorage.setItem("RefreshToken", dataResponse.refreshToken);
                localStorage.setItem("Email", dataResponse.email);
                nav("/dashboard");
            } 
            else if (!postData.ok) {
                const error = await postData.json();
                setError(t(`errors.${error.code}`));
                setIsLoading(false);
            }
        }
        catch(e) {
            setIsLoading(false);
            console.log("error occurs " + e);
        }
    }

    const handelDemo = () => {
        setValue("EmailRequired", "koko@gmail.com");
        setValue("passwordRequired", "Koko48128288@");
    };

    return (
        <>
            <section className={Style.Auth}>
                <h2 style={{textAlign : "center"}}>{t("AuthTitle")}</h2>
                <form action="" onSubmit={handleSubmit(onSubmit)}>
                    <h3>{t("AuthTitle2")}</h3>
                    <fieldset>
                        <legend>{t("AuthTitle3")}</legend>
                        <div>
                            <img src={userAuth} alt="userIcon" />
                            <input type="text" name="email" placeholder={t("AuthEmailPlaceholder")}  {...register("EmailRequired", { required: true, pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: t("AuthErrorEmailFormat")
                            } })}/>
                        </div>
                        {errors.EmailRequired?.type === "required" && <p className={Style.error}>{t("AuthErrorRequired")}</p>}
                        {errors.EmailRequired?.type === "pattern" && <p className={Style.error}>{errors.EmailRequired.message}</p>}

                        

                        <div>
                            <img src={passwordAuth} alt="passwordIcon" />
                            <input name="password" type={!ShowPassword ? "password" : "text"} placeholder={t("AuthPasswordPlaceholder")}  {...register("passwordRequired", { required: true })}/>
                            <span className={Style.Eye} onClick={() => SetShowPassword(!ShowPassword) }>
                                {!ShowPassword ? <EyeClosed color="rgb(14, 51, 38)"/> : <Eye color="rgb(14, 51, 38)"/> }
                            </span>
                        </div>
                        {errors.passwordRequired?.type === "required" && <p className={Style.error}>{t("AuthErrorRequired")}</p>}

                    </fieldset>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? <DotLottieReact src="/Lotties/loading.lottie" loop autoplay style={{ width: "50px", height: "50px" }} /> 
                        : t("AuthButtonLogin")}
                    </button>
                </form>
                {error && <p className={Style.errorMsg}>{error}</p>}
                <p>{t("AuthLittlePara")} AbdoBank ? <Link to="/register"><span>{t("HeaderSignup")}</span></Link></p>

                <div className={Style.Demo} onClick={handelDemo}>
                    <p>DEMO</p>            
                </div>
            </section>
            
        </>
    )
}