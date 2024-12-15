import React from 'react'
import { useNavigate } from 'react-router-dom'
import { UseUser } from '../context/UseUser.js'
import { SectionHeader } from '../components/header/Header.js'
import LoginForm from '../components/login/LoginForm.js'


// Define the authentication mode
export const AuthenticationMode = Object.freeze({
    Login: 'Login',
    Register: 'Register'
})

export default function Login({ authenticationMode }) {
    const { user, setUser, login, register } = UseUser()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (authenticationMode === AuthenticationMode.Register) {       // Check if user is registering or logging in
                await register()
                navigate('/signin')                                         // Redirect to login page after registration
            } else {
                await login()
                navigate('/')                                               // Redirect to home page after login
            }
        } catch (error) {
            const message = error.response && error.response.data ? error.response.data.error : error
            alert(message)
        }
    }

    return (
        <div>
            <SectionHeader text={authenticationMode === AuthenticationMode.Login ? 'Sign in' : 'Sign up'} />
            <LoginForm
                user={user}
                setUser={setUser}
                handleSubmit={handleSubmit}
                authenticationMode={authenticationMode}
            />
        </div>
    )
}