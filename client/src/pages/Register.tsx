import { useState } from "react"
import { baseURL } from "../utils/baseURL"


const Register = () => {

    const [formValues, setFormValues] = useState({
        email: "",
        username: "",
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
    try {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const body = JSON.stringify(formValues);
        const requestOptions = {
        method: "POST",
        headers,
        body,
        };
        const response = await fetch(baseURL + "/users/register", requestOptions)
        const result = await response.json()
        console.log(result)
    } catch (error) {
        console.log(error)
    }
    }
    return (
        <form onSubmit={submitHandler} >
            <h2>Register</h2>
            <input name='email' type="email" placeholder='add your email' value={formValues.email} onChange={changeHandler} />
            <input name='password' type="password" placeholder='add your password' value={formValues.password} onChange={changeHandler} />
            <input name='username' type="text" placeholder='add a username if you want' value={formValues.username} onChange={changeHandler} />
            <button type='submit'>register</button>
        </form>
    )
}

export default Register