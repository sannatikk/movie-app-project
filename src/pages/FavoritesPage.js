import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FavoriteList from "../components/favorites/FavoriteList";
import './FavoritesPage.css'

const url = process.env.REACT_APP_API_URL

function FavoritesPage() {
    const { id } = useParams() // Haetaan userId URL-osoitteesta
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [userName, setUserName] = useState('')

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!id) return

            try {
                const response = await fetch(url + '/favorites/' + id)
                if (!response.ok) throw new Error("Failed to fetch favorites")
                const data = await response.json()
                setFavorites(data)
                setUserName(data[0]?.uname || "No user found")
            } catch (error) {
                setError("Could not load favorites")
                console.log("Could not load favorites", error)
            } finally {
                setLoading(false)
            }
        }

        fetchFavorites()
    }, [id])

    return(
        <FavoriteList
            favorites = {favorites}
            userName = {userName}
            loading ={loading}
            error = {error}>
            </FavoriteList>
    )
}
export default FavoritesPage;
