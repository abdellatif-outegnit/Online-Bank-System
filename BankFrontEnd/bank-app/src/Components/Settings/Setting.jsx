import Style from "./Setting.module.css";
import { Cog, PenLine, UserRound, Mail , PhoneCall , LockKeyhole, KeyRound, LogOut } from 'lucide-react';
import Money from "../../Assets/money-100.png";
import { useState } from "react";
import EditProfile from "../EditProfile/EditProfile";
import EditPassword from "../EditPassword/EditPassword";
import { useNavigate } from "react-router";
import { useTranslation } from 'react-i18next';

const Setting = ({UserInfo, setUserInfo}) => {

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const { t } = useTranslation();
 
    const nav = useNavigate();

    return (
        <>
        <section className={Style.Setting}>
            <div className={Style.Head}>
                <div className={Style.SettingIcon}>
                    <Cog className={Style.iconColor}  size={35}/>
                </div>
                <div>
                    <h2>{t('Settings.title')}</h2>
                    <p>{t('Settings.description')}</p>
                </div>
            </div>

            <div className={Style.Profile}>
                <div className={Style.SubHeader}>
                    <div style={{display : "flex", alignItems : "center", gap : "20px"}}>
                        <div className={Style.SubHeaderIcon}>
                            <UserRound  className={Style.iconColor}  size={25}/>
                        </div>
                        <div className={Style.SubHeadInfo}>
                            <h3>{t('Settings.profile')}</h3>
                            <p>{t('Settings.profileDescription')}</p>
                        </div>
                    </div>
                    <button className={Style.ProfileBTN} type="button" onClick={() => setIsProfileOpen(true)}>
                        <PenLine />
                        <p>{t('Settings.editProfile')}</p>
                    </button>
                </div>

                <div className={Style.ProfileInfo}>
                    <div className={Style.ProfileHeader}>
                        <div className={Style.UserAvatar}>
                            <img src={Money} alt="UserAvatar" />
                        </div>
                        <div className={Style.ProfileHeaderInfo}>
                            <h3>{UserInfo?.customer?.firstName} {UserInfo?.customer?.lastName}</h3>
                            <p>{UserInfo?.role?.roleName}</p>
                        </div>
                    </div>
                    <div className={Style.ProfileFooter}>
                        <div className={Style.ProfileTable}>
                            <div className={Style.profileRowHead}> 
                                <UserRound size={20} />
                                <p>{t('Settings.firstName')}</p>
                            </div>
                            <p>{UserInfo?.customer?.firstName}</p>
                        </div>

                        <div className={Style.ProfileTable}>
                            <div className={Style.profileRowHead}> 
                                <UserRound size={20} />
                                <p>{t('Settings.lastName')}</p>
                            </div>
                            <p>{UserInfo?.customer?.lastName}</p>
                        </div>

                        <div className={Style.ProfileTable}>
                            <div className={Style.profileRowHead}> 
                                <Mail size={20} />
                                <p>{t('Settings.email')}</p>
                            </div>
                            <p>{UserInfo?.emailAddress}</p>
                        </div>

                        <div className={Style.ProfileTable}>
                            <div className={Style.profileRowHead}> 
                                <PhoneCall size={20} />
                                <p>{t('Settings.phone')}</p>
                            </div>
                            <p>{UserInfo?.customer?.phoneNumber}</p>
                        </div>

                    </div>
                </div>
            </div>

            <div className={Style.Security}>
                <div className={Style.SubHeader}>
                    <div style={{display : "flex", alignItems : "center", gap : "20px"}}>
                        <div className={Style.SubHeaderIcon}>
                            <LockKeyhole  className={Style.iconColor}  size={25}/>
                        </div>
                        <div className={Style.SubHeadInfo}>
                            <h3>{t('Settings.security')}</h3>
                            <p>{t('Settings.securityDescription')}</p>
                        </div>
                    </div>
                </div>
                <div className={Style.SecurityContent}>
                    <div style={{display : "flex", alignItems : "center", gap : "20px"}}>
                        <div className={Style.PasswordIcon}>
                            <KeyRound  className={Style.iconColor}  size={20}/>
                        </div>
                        <div className={Style.passwordInfo}>
                            <h3>{t('Settings.password')}</h3>
                            <p>{t('Settings.passwordDescription')}</p>
                        </div>
                    </div>
                    <button className={Style.PasswordBTN} type="button" onClick={() => setIsPasswordOpen(true)}>
                        <KeyRound />
                        <p>{t('Settings.changePassword')}</p>
                    </button>
                </div>

            </div>

            <div className={Style.Signout}>
                 <div className={Style.SignoutInfo}>
                    <div style={{display : "flex", alignItems : "center", gap : "20px"}}>
                        <div className={Style.singoutIconContainer}>
                            <LogOut  color="red"  size={25}/>
                        </div>
                        <div className={Style.SignOutInfo}>
                            <h3>{t('Settings.signOut')}</h3>
                            <p>{t('Settings.signOutDescription')}</p>
                        </div>
                    </div>
                    <div className={Style.SignoutBTN} onClick={async () => {
                        try {

                            const response = await fetch('https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/Auth/logout', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body : JSON.stringify({
                                            email : UserInfo?.emailAddress,
                                            refreshToken : localStorage.getItem("RefreshToken")
                                        })
                            });
                            localStorage.removeItem("AccessToken");
                            localStorage.removeItem("RefreshToken");
                            localStorage.removeItem("Email");

                            if(response.ok)
                                nav("/login")
                        }
                        catch(e)
                        {
                            console.log("error : " + e);         
                        }
                    }}>
                        <LogOut />
                        <p>{t('Settings.signOutButton')}</p>
                    </div>
                </div>
            </div>
           
        </section>
        {isProfileOpen && (
            <EditProfile
                profile={UserInfo}
                setProfile={setUserInfo}
                onClose={() => setIsProfileOpen(false)}
            />
        )}
        {isPasswordOpen && (
            <EditPassword onClose={() => setIsPasswordOpen(false)} />
        )}
        </>
    )
}

export default Setting;