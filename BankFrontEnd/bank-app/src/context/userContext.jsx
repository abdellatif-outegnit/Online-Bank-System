import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../utils/functions/ApiFunction";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function getUser() {
            try {
                const email = localStorage.getItem("Email");
                const accessToken = localStorage.getItem("AccessToken");

                if (!accessToken || !email) {
                    if (isMounted) {
                        setUser(null);
                        setIsReady(true);
                    }
                    return;
                }

                const response = await apiFetch(
                    "https://abdobank-frg0gterdjetfzct.southafricanorth-01.azurewebsites.net/api/user/me",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                    email
                );

                if (!response.ok) {
                    if (isMounted) {
                        setUser(null);
                    }
                    return;
                }

                const userData = await response.json();

                if (isMounted) {
                    setUser(userData?.userResponseDTO ?? null);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                if (isMounted) {
                    setUser(null);
                }
            } finally {
                if (isMounted) {
                    setIsReady(true);
                }
            }
        }

        getUser();

        return () => {
            isMounted = false;
        };
    }, []);

    const value = { user, setUser, isReady };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);

    if (context === null) {
        throw new Error("useUser doit être utilisé dans un UserProvider");
    }

    return context;
}
