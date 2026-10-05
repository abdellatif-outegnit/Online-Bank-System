import Style from "./Register.module.css";
import { Mail, UserRoundKey, Eye, EyeClosed  } from 'lucide-react';
import mk from "../../assets/morocco2.svg";
import { useForm } from "react-hook-form"
import { useTranslation } from 'react-i18next';
import { useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from "react-router";

const Register = () => {
    const { t, i18n } = useTranslation();
    const {
        register,
        handleSubmit,
        watch,
        getValues,
        formState: { errors },
    } = useForm();

    const [isLoading, setIsLoading] = useState(false);
    const [ShowPassword, SetShowPassword] = useState(false) ;
    const [showMsg, setShowMsg] = useState(null);
     const [errorMsg, setErrorMsg] = useState(null);

    const nav = useNavigate();

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const regData = await fetch("https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Auth/register", {
                    method : "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body : JSON.stringify({
                        firstName: data.name,
                        lastName: data.lastName,
                        birthDate: data.BirthDateRequired,
                        phoneNumber: ("+212" + data.PhoneRequired),
                        nationalID: data.cin,
                        emailAddress: data.EmailRequired,
                        password: data.PasswordRequired,
                        imagePath: "",
                        country: "Maroc",
                        city: data.Ville,
                        street: data.Rue,
                        postalCode: data.CodePostal
                    })
                }
            )

            if(regData.ok)
            {
                const dataResponse = await regData.json();
                const msg = dataResponse.code;
                setShowMsg(t(`successs.${msg}`));
                setTimeout(() => {
                    nav("/login");
                }, 1000);
            }

            const errorMessage = await regData.text();
            throw new Error(errorMessage);

        } catch(ex)
        {
            setErrorMsg(ex.message);
        }
        finally {
            setIsLoading(false);
        }

    }

    const { onChange: rhfOnChange, ...rest } = register("PhoneRequired", { 
        required: t("AuthErrorRequired"), 
        pattern: {
            value: /^[1-9][0-9]{0,8}$/,
            message: "Invalid format: the number needs to start with a digit other than 0"
        }
    });


    return (
        <section className={Style.Register}>
            <h2 style={{textAlign : "center", marginBottom: "10px"}}>{t("RegPara1")}</h2>
            <p style={{textAlign : "center" , color : "var(--smallpara-color)"}}>{t("RegPara2")}</p>

            <form action="" onSubmit={handleSubmit(onSubmit)}>

                <div className={Style.Title}>
                    <Mail size={48} />
                    <h2>{t("Reg1Title")}</h2>
                </div>

                <div className={Style.Row}>
                    <div>
                        <input type="text" placeholder={t("RegNamePlaceholder")} {...register("name", { required:  t("AuthErrorRequired")})} />
                        <p className={Style.Error}>{errors.name && errors.name.message}</p>
                    </div>
                    <div>
                        <input type="text" placeholder={t("RegLastNamePlaceholder")} {...register("lastName", { required:  t("AuthErrorRequired")})} />
                        <p className={Style.Error}>{errors.lastName && errors.lastName.message}</p>
                    </div>
                </div>

                <div className={Style.Row}>
                    <div>
                        <input type="date" placeholder="Date de naissanse" 
                                        {...register("BirthDateRequired", {
                            required: t("AuthErrorRequired"),
                            validate: (value) => {
                                const today = new Date();
                                const birthDate = new Date(value);

                                let age = today.getFullYear() - birthDate.getFullYear();
                                const monthDiff = today.getMonth() - birthDate.getMonth();
                                const dayDiff = today.getDate() - birthDate.getDate();

                                // adjust age if birthday hasn't occurred yet this year
                                if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                                    age--;
                                }

                                return age >= 18 || t("AuthErrorAge");
                            }
                        })}/>
                        {errors.BirthDateRequired && (
                            <p className={Style.Error}>{errors.BirthDateRequired.message}</p>
                        )}
                    </div>
                    <div>
                        <h6>{t("RegCountry")}</h6>
                        <input type="text" value="Maroc" disabled name="country"/>
                    </div>
                </div>


                  <div className={Style.Row}>
                    <div>
                        <div style={{
                            display : "flex",
                            gap : "10px",
                            alignItems: "end"
                        }}>
                            <img src={mk} alt="MoroccoFlag" />
                            <p style={{
                                    fontWeight : "bold",
                                    color : "var(--primary-color)"
                                }}>+212</p>

                            <input type="text" maxLength={9} minLength={9}
                            onChange={(e) => {
                                let entry = e.target.value;
                                if(isNaN(entry))
                                    e.target.value = entry.replace(/[^0-9]/g, ""); 
                                 rhfOnChange(e);
                            }} 
                             {...rest} />
                        </div>
                        <p className={Style.Error}>{errors.PhoneRequired && errors.PhoneRequired.message}</p>
                    </div>
                    <div>
                        <input type="text" placeholder="e.g. AB123456" maxLength={8} 
                        onChange={(e) => {
                            let value = e.target.value.toUpperCase();
                            value = value.replace(/[^A-Z0-9]/g, "");
                            e.target.value = value;
                        }}
                        {...register("cin", { 
                            required:  t("AuthErrorRequired"), 
                            pattern: {
                                value: /^[a-zA-Z]{1,2}[0-9]{4,6}$/,
                                message: t("RegCinFormat")
                            }
                        })} />
                        <p className={Style.Error}>{errors.cin && errors.cin.message}</p>
                    </div>
                </div>




                <div className={Style.Rowtwo}>
                    <div>
                        <input type="text" placeholder={t("RegCityPlaceholder")} {...register("Ville", { required:  t("AuthErrorRequired")})}/>
                        <p className={Style.Error}>{errors.Ville && errors.Ville.message}</p>
                    </div>
                    <div>
                        <input type="text" placeholder={t("RegStreetPlaceholder")} {...register("Rue", { required:  t("AuthErrorRequired")})}/>
                        <p className={Style.Error}>{errors.Rue && errors.Rue.message}</p>
                    </div>
                    <div>
                        <input type="number" placeholder={t("RegPostalCodePlaceholder")} {...register("CodePostal", { required:  t("AuthErrorRequired")})}/> 
                        <p className={Style.Error}>{errors.CodePostal && errors.CodePostal.message}</p>
                    </div>               
                </div>


                <div className={Style.Title}>
                    <UserRoundKey size={48} />
                    <h2>{t("Reg2Title")}</h2>
                </div>

                <input type="text" placeholder={t("AuthEmailPlaceholder")}  {...register("EmailRequired", { required: true, pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: t("AuthErrorEmailFormat")
                } })}/>
                {errors.EmailRequired?.type === "required" && <p className={Style.Error}>{t("AuthErrorRequired")}</p>}
                {errors.EmailRequired?.type === "pattern" && <p className={Style.Error}>{errors.EmailRequired.message}</p>}

                <div className={Style.Row}>
                    <div>
                        <div style={{display : "flex" , gap : "10px", alignItems : "end"}}>
                            <input type={ShowPassword ? "text" : "password"} placeholder={t("AuthPasswordPlaceholder")}
                            {...register("PasswordRequired", { required: true , minLength: {
                                    value: 8,
                                    message: t("AuthErrorPasswordMin")
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=[\]{};:'",.<>/\\|~`])[A-Za-z\d@$!%*?&#^()_\-+=[\]{};:'",.<>/\\|~`]{8,}$/,
                                    message: t("AuthErrorPasswordFormat")
                                } })}
                                />
                            <span className={Style.Eye} onClick={() => SetShowPassword(!ShowPassword) }>
                                    {!ShowPassword ? <EyeClosed color="rgb(14, 51, 38)"/> : <Eye color="rgb(14, 51, 38)"/> }
                            </span>
                        </div>
                        {errors.PasswordRequired?.type === "required" && <p className={Style.Error}>{t("AuthErrorRequired")}</p>}
                        {errors.PasswordRequired?.type === "minLength" && <p className={Style.Error}>{errors.PasswordRequired.message}</p>}
                        {errors.PasswordRequired?.type === "pattern" && <p className={Style.Error}>{errors.PasswordRequired.message}</p>}
                    </div>

                    <div className="PassField">                 
                        <input type={ShowPassword ? "text" : "password"} placeholder={t("RegRepeatPassword")} {...register("ConfirmPasswordRequired", {
                            required: t("AuthErrorRequired"),
                            validate: (value) => 
                                value === getValues("PasswordRequired") || t("AuthErrorPasswordMismatch")
                        })} />
                        {errors.ConfirmPasswordRequired && (
                            <p className={Style.Error}>{errors.ConfirmPasswordRequired.message}</p>
                        )}
                    </div>

                </div>

                <button disabled={isLoading}> {isLoading ? <DotLottieReact src="/Lotties/loading.lottie" loop autoplay style={{ width: "50px", height: "50px" }} /> 
                        : t("RegButton")}</button>

            </form>
            {showMsg && <p className={Style.Success}>{showMsg}</p>}
            {errorMsg && <p style={{color : "red", textAlign : "center"}}>{errorMsg}</p>}
        </section>
    )
}

export default Register;