import { Cancel, Room } from '@material-ui/icons'
import axios from 'axios'
import React, { useRef, useState } from 'react'
import './register.css'

export default function Register({setShowRegister}) {
    const [success, setSuccess] = useState(false)
    const [failure, setFailure] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })

    const { username, email, password} = formData

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value})
    // const nameRef = useRef()
    // const emailRef = useRef()
    // const passwordRef = useRef()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username,
            email,
            password 
        }

        try {
            await axios.post('/user/register', newUser)
            setFailure(false)
            setSuccess(true)
        } catch (error) {
            setFailure(true)
            console.log(error)
        }
    }

    return(
        <div className='registerContainer'>
            <div className='logo'>
                <Room />ElidonPin
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" name='username' value={username} onChange={e => onChange(e)} ></input>
                <input type="email" placeholder="Email" name='email' value={email} onChange={e => onChange(e)}></input>
                <input type="password" placeholder="Password" name='password' value={password} onChange={e => onChange(e)}></input>
                <button className="registerButton" type="submit">Register</button>
                {success && <span className="success">Great! You can login now.</span>}
                {failure && <span className="failure">Something went wrong.</span>}
                <Cancel className="registerCancel" onClick={() => setShowRegister(false)}></Cancel>
            </form>
        </div>
    )
}