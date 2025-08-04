/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react"
import type { User } from "../@types"
import { baseURL } from "../utils/baseURL"

interface AuthContextType {
    user: User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

interface ActiveUserResponse {
    message: string,
    user: User
}

const defaultValue = {
    user: null,
    setUser: () => { throw new Error("context not implemented")}
}

export const AuthContext = createContext<AuthContextType>(defaultValue);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log(token);
        const getActiveUser = async() => {
            try {
                const headers = new Headers();
                headers.append("Authorization", "Bearer " + token);
                const requestOptions = {
                    method: "GET",
                    headers
                };
                const response = await fetch(baseURL + "/users/me", requestOptions);
                if (response.ok) {
                    const result: ActiveUserResponse = await response.json();
                    console.log(result);
                    setUser(result.user)
                } else {
                    const error = await response.json();
                    console.log("error", error)
                    localStorage.removeItem("token")
                }
            } catch (error) {
                console.log("catch error", error);
            }
        }
        if (token) getActiveUser()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser }} >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}