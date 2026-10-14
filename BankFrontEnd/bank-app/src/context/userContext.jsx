import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiFetch } from "../utils/functions/ApiFunction";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    
    const [user, setUser] = useState(null);
    const [isReady, setIsReady] = useState(false);

    const refreshUser = useCallback(async () => {
        setIsReady(false);

        try {
            const email = localStorage.getItem("Email");
            const accessToken = localStorage.getItem("AccessToken");

            if (!accessToken || !email) {
                setUser(null);
                return null;
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
                throw new Error(`User request failed with status ${response.status}`);
            }

            const userData = await response.json();
            const nextUser = userData?.userResponseDTO ?? null;

            setUser(nextUser);

            return nextUser;

        } catch (error) {

            console.error("Error fetching user:", error);
            setUser(null);
            return null;

        } finally {
            setIsReady(true);
        }
    }, []);

    useEffect(() => {
        refreshUser();

    }, [refreshUser]);

    const value = { user, setUser, isReady, refreshUser };

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
