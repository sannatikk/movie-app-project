import React, { useEffect, useState } from 'react'
import { fetchGenres } from '../../api/fetchTMDB'

// this component is used to select a genre from a list of genres
// it calls the fetchGenres function to get the up-to-date list of genres+ids from the API

function GenreSelect({ selectedGenre, onGenreChange }) {
    const [genres, setGenres] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadGenres = async () => {
            try {
                const data = await fetchGenres()
                setGenres(data.genres || [])   // set the genres in state or an empty array if no genres are returned
            } catch (error) {
                console.error('Error fetching genres:', error)
                setError('Failed to load genres.')
            }
        };
        loadGenres()
    }, []) // empty dependency array means this effect runs once after the first render

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <select
                value={selectedGenre}
                onChange={(e) => onGenreChange(e.target.value)} // call onGenreChange when the select value changes
            >
                <option value="">Select Genre</option>
                {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>    {/* use the genre id as the value but do not display it */}
                        {genre.name}                            {/* display the corresponding genre name */}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default GenreSelect