import React, { useEffect, useState } from "react";
import { SectionHeader } from "../header/Header";
import { UseUser } from "../../context/UseUser";

const url = process.env.REACT_APP_API_URL

const AddToFavoritesButton = ({ movie }) => {
    const { user, token, readAuthorizationHeader } = UseUser()
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [isFavorites, setIsFavorites] = useState(false)

    useEffect(() => {
        const checkIfFavorite = async () => {
            
                try{
                    const response = await fetch( url + `/favorites/${user.id}`)
                    if (!response.ok) {
                        throw new Error("Failed to fetch favorites")
                    }
                    const data = await response.json()

                    const movieExists = data.some(favorite => favorite.movie_id === movie.id)
                    setIsFavorites(movieExists)

                } catch (error){
                    console.error('Error checking if favorite: ',error)
                }
        } 

        checkIfFavorite()
    }, [user, token, movie.id])


    const handleAddFavorite = async () => {

        try {
            const response = await fetch(url + '/favorites', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    user_id: user.id,
                    movie_id: movie.id,
                    movie_name: movie.title,
                }),
            })
            if (!response.ok) {
                throw new Error("Failed to add favorite")
            }
            readAuthorizationHeader(response)
            setSuccess(true)
            setError(null)
            setIsFavorites(true)
        } catch (error) {
            setError("Could not add favorite.")
            setSuccess(false)
        }
    }
        if(token && user){
        return (
            <div>
                <SectionHeader text="Add Movie to Favorites" />
                <button onClick={handleAddFavorite} 
                disabled={isFavorites}> {!isFavorites ? "Add To Favorites" : "Already in favorites"} </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>Movie added to favorites!</p>}
            </div>
        )
    } else {
        return (
            <div>
                <SectionHeader text="Add Movie to Favorites" />
                <p><i>Log in to add this movie to your favorites</i></p>
            </div>
        )
    }
   
}


export default AddToFavoritesButton