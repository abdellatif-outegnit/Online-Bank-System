import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Style from "./EditProfile.module.css";
import { useForm } from "react-hook-form";
import flag from "../../assets/morocco2.svg";
import { apiFetch } from "../../utils/functions/ApiFunction";
import { useTranslation } from 'react-i18next';

const EditProfile = ({ profile, setProfile, onClose }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            firstName: profile?.customer?.firstName ?? "",
            lastName: profile?.customer?.lastName ?? "",
            email: profile?.emailAddress ?? "",
            phone: profile?.customer?.phoneNumber?.slice(4) ?? "",
        },
    });

    const [CustomError, setCustomError] = useState({status :false, msg : ""});
    const [success , setSuccess] = useState({status :false, msg : ""});
    const { t } = useTranslation();


    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const onSubmit = async (data) => {

        const profileData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: "+212" + data.phone,
        };

        setSuccess({status : false, msg : ""})
        setCustomError({status : false, msg : ""})

        try {

            const Data = await apiFetch("https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/User/updateProfile", {
                    method : "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body : JSON.stringify(profileData)
                }, profile?.emailAddress)

            if(Data.ok)
            {
                const dataResponse = await Data.text();
                setSuccess({status : true, msg : dataResponse})
                setProfile({...profile, emailAddress : profileData.email, customer : {...profile?.customer, firstName : profileData.firstName, lastName : profileData.lastName, phoneNumber : profileData.phoneNumber} })
            }

        }
        catch(ex) {
            console.log("Error message : " + ex);
        }
    };

    return (
        <div className={Style.overlay} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <section className={Style.modal} role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
                <header className={Style.header}>
                    <div>
                        <h2 id="edit-profile-title">{t('EditProfile.title')}</h2>
                        <p>{t('EditProfile.description')}</p>
                    </div>
                    <button className={Style.closeButton} type="button" onClick={onClose} aria-label="Close edit profile">
                        <X size={22} />
                    </button>
                </header>

                <form className={Style.form} onSubmit={handleSubmit(onSubmit)}>
                    <label>
                        {t('Settings.firstName')}
                        <input {...register("firstName", { required: "this field required", minLength: { value: 2, message: "min length is 2" } })}
                        defaultValue={profile?.customer?.firstName} />
                    </label>
                    {errors?.firstName?.message && <p className={Style.error}>{errors.firstName.message}</p>}
                    <label>
                        {t('Settings.lastName')}
                        <input {...register("lastName", { required: "this field required", minLength: { value: 2, message: "min length is 2" } })}
                        defaultValue={profile?.customer?.lastName} />
                    </label>
                    {errors?.lastName?.message && <p className={Style.error}>{errors.lastName.message}</p>}
                    <label>
                        {t('Settings.email')}
                        <input type="email" {...register("email", { required: "this field required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "enter a valid email" } })}
                        defaultValue={profile?.emailAddress} />
                    </label>
                    {errors?.email?.message && <p className={Style.error}>{errors.email.message}</p>}
                    <label>
                        {t('Settings.phone')}
                        <div style={{display : "flex", alignItems: "center", gap : "10px"}}>
                            <img src={flag} alt="moroccan flag" /><span>+212</span>
                            <input type="tel" {...register("phone", { required: "this field required", pattern: { value: /[\d]{9}$/, message: "enter a valid phone number" },
                                 maxLength : { value: 9, message: "max length is 9" } })}
                                 defaultValue={profile?.customer?.phoneNumber?.slice(4)} />
                        </div>
                    </label>
                    {errors?.phone?.message && <p className={Style.error}>{errors.phone.message}</p>}
                    {success && <p style={{ color : "green"}}>{success.msg}</p>}
                    <footer className={Style.footer}>
                        <button className={Style.cancelButton} type="button" onClick={onClose}>{t('EditProfile.cancel')}</button>
                        <button className={Style.saveButton} type="submit">{t('EditProfile.save')}</button>
                    </footer>
                </form>
            </section>
        </div>
    )
}

export default EditProfile;