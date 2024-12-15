import React from "react"
import { Link } from "react-router-dom"
import { MainHeader } from "../header/Header"

const FavoriteList = ({ userName, favorites, loading, error }) => {

    if (loading) {
        return <p>Loading...</p>
    }   
    if( error ){
        return <p style={{ color: "red" }}>{error}</p>
    }
    if (favorites.length === 0) {
        return <p><i>This list is empty.</i></p>
    }
    
return (
    <div> 
        <MainHeader text={userName + "'s Favorite Movies"} />
        <ul className="permalink-favorites-list">
            {favorites.map((fav) => (
            <li key={fav.id}>
                <Link to={`/movie/${fav.movie_id}`}> {fav.movie_name}</Link> 
            </li>
            ))}
        </ul>
    </div>
)

}
export default FavoriteList
