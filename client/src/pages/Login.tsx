import { useState } from "react"
import { baseURL } from "../utils/baseURL"
import { useAuth } from "../context/AuthContext"
import type { User } from "../@types"

interface LoginResult {
    user: User,
    token: string,
    authenticated: boolean
}

const Login = () => {

    const { setUser } = useAuth()

    const [formValues, setFormValues] = useState({
        email: "",
        password: ""
    })

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues((prev) => {
            return {
            ...prev,
            [e.target.name]: e.target.value
            }
        })
    }

    const submitHandler = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        const body = new URLSearchParams();
        body.append("email", formValues.email);
        body.append("password", formValues.password);

        const requestOptions = {
            method: "POST",
            headers,
            body,
        };

        try {
            const response = await fetch(baseURL + "/users/login", requestOptions);
            if (response.ok) {
                const result: LoginResult = await response.json();
                console.log(result);
                setUser(result.user);
                localStorage.setItem("token", result.token);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <form onSubmit={submitHandler} >
            <h2>Login</h2>
            <input name='email' type="email" placeholder='add your email' value={formValues.email} onChange={changeHandler} />
            <input name='password' type="password" placeholder='add your password' value={formValues.password} onChange={changeHandler} />
            <button type='submit'>login</button>
        </form>
    )
}

export default Login