import { useEffect, useState } from "react"
import '../../index.css'



function ThemeToggle() {
    const [darkTheme, setDarkTheme] = useState(false)

    useEffect(() => {
        const isDark = localStorage.getItem('darkTheme') === ('false')
        setDarkTheme(isDark)
        document.body.classList.toggle('dark-theme', isDark)
    }, [])


    const toggleTheme = () => {
        const theme = !darkTheme
        setDarkTheme(theme)
        localStorage.setItem('darkTheme', darkTheme)
        document.body.classList.toggle('dark-theme', theme)
    }

    return (
        <div 
            onClick={toggleTheme}
            className="theme-toggle">
                {darkTheme ? (<span role='img'>☀️</span>) 
                : <span role='img' >🌒</span>}
            </div>
            
    )
}

export default ThemeToggle