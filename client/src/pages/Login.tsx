import { useState } from "react"


const Register = () => {

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
        console.log("submit")
    }
    return (
        <form onSubmit={submitHandler} >
            <h2>Login</h2>
            <input name='email' type="email" placeholder='add your email' value={formValues.email} onChange={changeHandler} />
            <input name='password' type="password" placeholder='add your password' value={formValues.password} onChange={changeHandler} />
            <button type='submit'>register</button>
        </form>
    )
}

export default Register