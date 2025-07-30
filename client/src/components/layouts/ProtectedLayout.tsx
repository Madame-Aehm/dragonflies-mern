import { useAuth } from "../../context/AuthContext"
import { Link, Outlet } from "react-router";


const ProtectedLayout = () => {
    const { user } = useAuth();
    console.log("layout user", user)
    if (!user) return <p>Please <Link to={"/login"}>login</Link> or <Link to={"/signup"}>sign up</Link></p>
    else return <Outlet context={user} />;
}

export default ProtectedLayout