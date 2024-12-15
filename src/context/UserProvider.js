import React from 'react'
import { useState, useEffect } from 'react'
import { UserContext } from './UserContext.js'
import axios from 'axios'

const url = process.env.REACT_APP_API_URL

export default function UserProvider({ children }) {
    // Get user and token from session storage
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    // Initialize user and token states with session storage values
    const [user, setUser] = useState(() => {
        return storedUser ? JSON.parse(storedUser) : { id: null, username: '' }
    })
    const [token, setToken] = useState(() => {
        return storedToken || null
    })

    useEffect(() => {
        // Refresh the session storage when user or token changes
        if (user.id) {
            localStorage.setItem('user', JSON.stringify(user))
        } else {
            localStorage.removeItem('user')
        }

        if (token) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
        }
    }, [user, token])

    useEffect(() => {
    }, [token])

    // Login user API call
    const login = async () => {
        const headers = { headers: { 'Content-Type': 'application/json' } }
        const data = { username: user.username, password: user.password }

        try {
            const response = await axios.post(url + '/user/login', data, headers)
            const { id, username: uname } = response.data         // Save id and username to userData
            await readAuthorizationHeader(response)        // Read token from response header
            setUser({ id, username: uname })                            // Save id and username to user            
        } catch (error) {
            setUser({ username: '', password: '' })                    // Set user and password fields empty
            setToken(null)                                            // Set token to null
            console.log('Login error: ', error)
            throw error
        }
    }

    const readAuthorizationHeader = async (response) => {
        if (response.headers.get('authorization') && 
            response.headers.get('authorization').split(' ')[0] === 'Bearer') {
            const newToken = response.headers.get('authorization').split(' ')[1]
            updateToken(newToken)
        }
    }

    // Register user API call
    const register = async () => {
        const headers = { headers: { 'Content-Type': 'application/json' } }
        const data = { username: user.username, password: user.password }

        try {
            await axios.post(url + '/user/register', data, headers)
            setUser({ username: '', id: null })                       // Empty user and id fields
        } catch (error) {
            throw error
        }
    }

    // Logout user
    const logout = async () => {
        setUser({ id: null, username: '' }) // Set id and username fields empty
        setToken(null)                      // Set token to null
        localStorage.removeItem('user')   // Remove user from session storage
        localStorage.removeItem('token')  // Remove token from session storage
    }

    const updateToken = (newToken) => {
        setToken(newToken)
    }

    return (
        <UserContext.Provider value={{ user, setUser, register, login, logout, token, updateToken, readAuthorizationHeader }} >
            {children}
        </UserContext.Provider>
    )
}