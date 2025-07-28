import type { PropsWithChildren } from "react"
import { useAuth } from "../../context/AuthContext"
import { Link } from "react-router";


const ProtectedLayout = ({ children }: PropsWithChildren) => {
    const { user } = useAuth();
    if (!user) return <p>Please <Link to={"/login"}>login</Link> or <Link to={"/signup"}>sign up</Link></p>
    else return children;
}

export default ProtectedLayout