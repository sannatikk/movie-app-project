import React from "react"
import { Link } from "react-router-dom"
import { AuthenticationMode } from "../../pages/LoginPage"

export default function LoginForm({ user, setUser, handleSubmit, authenticationMode }) {
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input type='text' value={user.username || ''} onChange={e => setUser({ ...user, username: e.target.value })} autoFocus/>
                </div>
                <div>
                    <label>Password</label>
                    <input type='password' value={user.password || ''} onChange={e => setUser({ ...user, password: e.target.value })} />
                </div>
                <div>
                    <button> {authenticationMode === AuthenticationMode.Login ? 'Login' : 'Register'}</button>
                </div>
                <div>
                    <Link to={authenticationMode === AuthenticationMode.Login ? '/signup' : '/signin'}>
                        {authenticationMode === AuthenticationMode.Login ? 'No account? Sign up here' : 'Already have an account? Sign in here'}
                    </Link>
                </div>
            </form>
        </>
    )
}