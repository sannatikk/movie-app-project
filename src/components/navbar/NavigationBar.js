import React from 'react'
import { useState, useEffect } from 'react';
import { UseUser } from '../../context/UseUser'
// Using NavLink the browser checks if the current URL matches the Link and you can add CSS to the specific Link th is way
// Outlet is used as a placeholder for the "children" elemenent. in this case the children element the specific Page
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import "./NavigationBar.css"
import ThemeToggle from '../theme/ThemeToggle';

const NavigationBar = () => {
    const { user, logout, token } = UseUser()
    const [logged, setLogged] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (token) {
            setLogged(true)
        } else {
            setLogged(false)    // Set logged to false when token is removed
        }
    }, [token])

    const logoutFunction = () => {
        setLogged(false)
        logout()
        navigate('/')
        closeMenu()
    }

    // Function to toggle the menu
    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }

    const closeMenu = () => {
        setMenuOpen(false)
    }

    return (
        <>
            <header>
                <nav className="navbar">
                    <button className="hamburger" onClick={toggleMenu}>
                        ☰
                    </button>
                    <div className={`menu-container ${menuOpen ? 'open' : ''}`}>
                        <div className="nav-links">
                            <NavLink to="/" activeclassname="current" onClick={closeMenu}>Movies</NavLink>
                            <NavLink to="/reviews" activeclassname="current" onClick={closeMenu}>Reviews</NavLink>
                            <NavLink to="/groups" activeclassname="current" onClick={closeMenu}>Groups</NavLink>
                            <NavLink to="/showtimes" activeclassname="current" onClick={closeMenu}>Showtimes</NavLink>
                            {logged && <NavLink to="/members" activeclassname="current" onClick={closeMenu}>Members</NavLink>}
                            <ThemeToggle />
                        </div>
                        <div className="nav-user">
                            {logged ? (
                                <>
                                    <NavLink to={`/account/${user.id}`} activeclassname="current" onClick={closeMenu}>My Account</NavLink>
                                    <button onClick={logoutFunction} id='nav-button'>Logout</button>
                                </>
                            ) : (
                                <NavLink to="/signin" activeclassname="current" onClick={closeMenu}>Login</NavLink>
                            )}
                        </div>
                    </div>
                </nav>
            </header>
            <div className="main-wrapper">
                <Outlet />
            </div>
        </>
    )
}

export default NavigationBar