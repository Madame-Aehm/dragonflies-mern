/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react"
import type { User } from "../@types"

interface AuthContextType {
    user: User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>
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