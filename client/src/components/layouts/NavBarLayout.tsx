import type { PropsWithChildren } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import LogOut from "./LogOut";


function NavBarLayout({ children }: PropsWithChildren) {
    const { user } = useAuth();
    const containerStyle = { height: "50px", display: "flex", gap: "1em", alignItems: "center", border: "solid black 2px", marginBottom: "1em", padding: "0 1em 0"  }
    return (
        <>
            <div style={containerStyle}>
                <Link to={"/"}>Homepage</Link>
                { !user && <>
                    <Link to={"/login"}>Login</Link>
                    <Link to={"/register"}>Register</Link>
                </>}
                { user && 
                    <>
                        <LogOut />
                        <p style={{ alignSelf: "end" }}>{user.username}</p>
                    </>
                }
                
            </div>
            { children }
        </>
    )
}

export default NavBarLayout