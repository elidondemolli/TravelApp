import { Cancel, Room } from '@material-ui/icons'
import axios from 'axios'
import React, { useRef, useState } from 'react'
import './login.css'

export default function Register({setShowLogin, myStorage, setCurrentUser}) {
    const [success, setSuccess] = useState(false)
    const [failure, setFailure] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    const { username, password} = formData

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value})

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username,
            password 
        }

        try {
            const res = await axios.post('/user/login', newUser)
            myStorage.setItem('user', res.data.result )
            setCurrentUser(res.data.result)
            setShowLogin(false)
            setFailure(false)
            setSuccess(true)
        } catch (error) {
            setFailure(true)
            console.log(error)
        }
    }

    return(
        <div className='loginContainer'>
            <div className='logo'>
                <Room />ElidonPin
            </div>
            <form onSubmit={handleSubmit}>
                <input type="username" placeholder="Username" name='username' value={username} onChange={e => onChange(e)}></input>
                <input type="password" placeholder="Password" name='password' value={password} onChange={e => onChange(e)}></input>
                <button className="loginButton" type="submit">Login</button>
                {success && <span className="success">Great!</span>}
                {failure && <span className="failure">Something went wrong.</span>}
                <Cancel className="loginCancel" onClick={() => setShowLogin(false)}></Cancel>
            </form>
        </div>
    )
}