import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MainHeader } from '../components/header/Header.js'
import { fetchMovieNames } from '../utils/helperFunctions.js'
import AllReviews from '../components/reviews/AllReviews.js'
import './Reviews.css'

function Reviews() {
    const [reviews, setReviews] = useState([])
    const [movies, setMovies] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const url = process.env.REACT_APP_API_URL

    useEffect(() => {
        axios
            .get(url + '/reviews')
            .then(async (response) => {
                const fetchedReviews = response.data
                setReviews(fetchedReviews)
                const moviesData = await fetchMovieNames(fetchedReviews)
                setMovies(moviesData)
            })
            .catch((error) => {
                setError('Error fetching reviews: ' + error.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [url])

    if (loading) {
        return <h3>Loading...</h3>
    }

    if (error) {
        return <h3>{error}</h3>
    }

    return (
        <div>
            <MainHeader text="All Reviews" />
            <AllReviews reviews={reviews} movies={movies} /> {/* Pass the reviews and movies to the ReviewList component */}
        </div>
    )
}

export default Reviews