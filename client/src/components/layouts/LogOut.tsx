import { useAuth } from "../../context/AuthContext"


const LogOut = () => {
    const { setUser } = useAuth()
    const handleClick = () => {
        localStorage.removeItem("token");
        setUser(null);
    }
    return (
        <button onClick={handleClick}>Logout</button>
    )
}

export default LogOut