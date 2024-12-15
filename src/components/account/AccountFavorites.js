import axios from "axios"
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react"
import { UseUser } from '../../context/UseUser.js'


const url = process.env.REACT_APP_API_URL


function ProfileFavoriteList({ id }) {
    const [favorites, setFavorites] = useState([])
    const { user, token, readAuthorizationHeader } = UseUser()
    const [error, setError] = useState(null)  // state to handle errors
    const [loading, setLoading] = useState(true)  // state to manage loading state


    const navigate = useNavigate()

    useEffect(() => {

        if (!token) {
            navigate('/error')
        }

        const fetchFavoritesById = async (id) => {
            try {
                const response = await axios.get(url + "/favorites/" + id)
                return response.data
            }
            catch (error) {
                console.error('Error', error)
                if (error.status === 404) {

                }
            }
        }

        const getFavorites = async () => {
            try {
                const data = await fetchFavoritesById(id)  // fetch reviews
                if (data) {
                    setFavorites(data)
                }
            } catch (error) {
                setError(error.message)
                console.error('Error getting favorites:', error)
            } finally {
                setLoading(false)
            }
        }

        getFavorites()

    }, [id, token, user.id, navigate])


    if (loading) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p style={{ color: "red" }}>{error}</p>
    }

    const deleteFavorite = async (id) => {
        try {
            const response = await axios.delete(url + "/favorites/" + id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            await readAuthorizationHeader(response)
            setFavorites(favorites.filter(a => a.id !== id))
        }
        catch (error) {
            console.error('Error', error)
            throw error
        }
    }

    function checkFavoriteButton(id_for_Button) {
        if (parseInt(user.id) === parseInt(id)) {
            return (
                <button id={id_for_Button} onClick={() => deleteFavorite(id_for_Button)}>Delete</button>
            )
        }
        else {
            return (
                <></>
            )
        }
    }
    return (
        <div>
            {favorites.length === 0 ? (
                <p><i>This user hasn't marked any movies as favorites.</i></p>
            ) : (
                <table className="user-favorites-table">
                    <tbody>
                        {favorites.map((favorite) => (
                            <tr key={favorite.id}>
                                <td>
                                    <Link to={`/movie/${favorite.movie_id}`}>{favorite.movie_name}</Link>
                                </td>
                                <td>
                                    {checkFavoriteButton(favorite.id)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default ProfileFavoriteList