/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type PropsWithChildren } from "react"
import type { User } from "../@types"

interface AuthContextType {
    user: User | null
}

const defaultValue = {
    user: null
}

export const AuthContext = createContext<AuthContextType>(defaultValue);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User | null>(null)



    return (
        <AuthContext.Provider value={{ user }} >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}