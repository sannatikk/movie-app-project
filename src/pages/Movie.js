import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { fetchMovieById } from '../api/fetchTMDB.js'
import { SectionHeader } from '../components/header/Header.js'
import MovieDetails from '../components/movies/MovieDetails.js'
import ReviewByMovie from '../components/reviews/ReviewByMovie.js'
import LeaveReview from '../components/reviews/LeaveReview.js'
import AddMovieToGroup from '../components/groups/AddMovieToGroup.js'
import AddToFavoritesButton from '../components/favorites/AddToFavoritesButton.js'
import './Movie.css'

function Movie() {

    const { id } = useParams()  // movie ID from URL
    const [movie, setMovie] = useState(null)  // state to store movie data
    const [reviews, setReviews] = useState([]) // Store reviews by movie_id
    const [loading, setLoading] = useState(true)  // state to manage loading state
    const [error, setError] = useState(null)  // state to handle errors

    const url = process.env.REACT_APP_API_URL

    // Function to re-fetch reviews for the current movie
    const refreshReviews = async () => {
        try {
            const response = await axios.get(url + `/reviews/movie/${id}`)
            setReviews(response.data)  // Update the reviews state with the new data
        } catch (error) {
            console.error('Error fetching reviews:', error)
        }
    }

    useEffect(() => {
        const getMovie = async () => {
            try {
                const data = await fetchMovieById(id)  // fetch movie data
                if (data.success === false) {
                    throw new Error(data.status_message || 'An unknown error occurred');
                }
                setMovie(data)  // set the movie data in state
            } catch (error) {
                setError(error.message)
                console.error('Error fetching movie:', error)
            } finally {
                setLoading(false)
            }
        }
        getMovie()  // call function to fetch movie data
    }, [id])    // run effect when ID changes

    useEffect(() => {
        axios.get(url + `/reviews/movie/${id}`)  // fetch reviews by movie ID after movie data is fetched
        .then(response => {
            setReviews(response.data)
        })
        .catch (error => {
            console.error('Error fetching reviews:', error)
        }
        )
    }, [id, url])  // run effect when ID or URL changes

    if (loading) {
        return <h3>Loading...</h3>  // message while fetching
    }

    if (error) {
        return <h3>Error: {error}</h3>
    }


    return (
        <div>
            <center>
                {movie && <MovieDetails movie={movie} />}   {/* pass movie data to MovieDetails */}
                <div className="movie-actions">
                    <AddToFavoritesButton movie={movie} />   {/* pass movie data to AddToFavoritesButton */}
                    <AddMovieToGroup movie={movie} />   {/* pass movie data to AddMovieToGroup */}
                </div>
                <SectionHeader text='Leave a Review' />
                <LeaveReview movieId={id} reviews={reviews} refreshReviews={refreshReviews}/>   {/* pass along movie id refreshReviews function to LeaveReview*/}
                {reviews.length > 0 && <ReviewByMovie reviews={reviews} />}     {/* pass review data to ReviewByMovie */}
            </center>
        </div>
    )
}

export default Movie