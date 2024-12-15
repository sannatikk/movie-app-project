
import { fetchMovieById } from '../api/fetchTMDB'

// this function replaces movie_id with movie name in reviews
const fetchMovieNames = async (reviews) => {
    const moviesData = {}
    for (const review of reviews) {
        if (!moviesData[review.movie_id]) {
            try {
                const movieData = await fetchMovieById(review.movie_id) // get movie data by movie_id
                moviesData[review.movie_id] = movieData.title // store movie name
            } catch (error) {
                console.error(`Error fetching movie title ${review.movie_id}:`, error)
            }
        }
    }
    return moviesData // Return the movies data object with movie_id as key and movie name as value
}

// this returns a string of stars and empty stars based on integer 1-5
const renderStars = (stars) => {
    const filledStars = '★'.repeat(stars)
    const emptyStars = '☆'.repeat(5 - stars)
    return filledStars + emptyStars
}


// this returns a formatted date string from database in "18.11.2024 15:05:59" format
const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    let formattedDate = date.toLocaleString('fi-FI')
    formattedDate = formattedDate.replace(' klo', ' ')
    return formattedDate
}


export { renderStars, formatTimestamp, fetchMovieNames } 