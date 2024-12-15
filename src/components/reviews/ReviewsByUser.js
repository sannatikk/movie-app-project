// Use this component using the following code format: <ReviewsByUser id={123} />

import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { fetchMovieNames, renderStars, formatTimestamp } from "../../utils/helperFunctions.js"
import { UseUser } from '../../context/UseUser.js'


function ReviewsByUser({ id }) {
    const { user, token, readAuthorizationHeader } = UseUser()
    const [reviews, setReviews] = useState([]) // State to store user reviews
    const [movies, setMovies] = useState({}) // State to store movie names
    const [loading, setLoading] = useState(true) // State to track loading
    const [error, setError] = useState(null) // State to store errors
    const params = useParams()

    const url = process.env.REACT_APP_API_URL

    useEffect(() => {

        const fetchUserReviews = async () => {

            try {
                const response = await axios.get(`${url}/reviews/user/${id}`)
                const fetchedReviews = response.data
                setReviews(fetchedReviews)

                // Fetch movie names for the reviews
                const moviesData = await fetchMovieNames(fetchedReviews)
                setMovies(moviesData)

            } catch (error) {
                setError(`Error fetching reviews: ${error.message}`)
            } finally {
                setLoading(false)
            }
        }

        fetchUserReviews()

    }, [id, url]) // Run effect when id or url changes

    const deleteReview = async (id) => {
        try {
            const headers = { headers: { Authorization: `Bearer ${token}` } }
            const response = await axios.delete(url + "/Reviews/" + id, headers)
            await readAuthorizationHeader(response)    // update token if it is returned in the response
            setReviews(reviews.filter(a => a.id !== id))
        }
        catch (error) {
            console.error('Error', error)
            throw error
        }
    }
    function checkReviewButton(id_for_Button) {

        if (parseInt(user.id) === parseInt(params.id)) {
            return (
                <button id={id_for_Button} onClick={() => deleteReview(id_for_Button)}>Delete</button>
            )
        }
        else {
            return null
        }
    }

    if (loading) {
        return <h4>Loading...</h4>
    }

    if (error) {
        return <h4>{error}</h4>
    }

    return (
        <div>
            {reviews.length === 0 ? (
                <p><i>This user hasn't reviewed any movies.</i></p>
            ) : (
                <>
                    {/* card layout for smaller screens */}
                    <div className="user-review-cards">
                        {reviews.map((review) => (
                            <div key={review.id} className="user-review-card highlight-box">
                                <h3><Link to={`/movie/${review.movie_id}`}>{movies[review.movie_id] || 'Unable to Fetch Title'}</Link>: {review.review_title}</h3>
                                <p>{renderStars(review.stars)}</p>
                                <p>{review.review_body}</p>
                                <p><i>Reviewed by <Link to={`/account/${review.account_id}`}>{review.uname}</Link></i></p>
                                <p><i>{formatTimestamp(review.created_at)}</i></p>
                                {parseInt(user.id) === parseInt(params.id) && (
                                    <div className="user-review-card-delete">
                                        {checkReviewButton(review.id)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* table for larger screens */}
                    <div className="user-review-table-container">
                        <table className="user-reviews-table highlight-box">
                            <thead>
                                <tr>
                                    <th id="rated-movie">Movie</th>
                                    <th id="movie-rating">Rating</th>
                                    <th id="review-title">Title</th>
                                    <th id="review-body">Review</th>
                                    <th id="review-timestamp">Time Reviewed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((review) => (
                                    <tr key={review.id}>
                                        <td id="rated-movie"><Link to={`/movie/${review.movie_id}`}>{movies[review.movie_id] || "Unable to Fetch Title"}</Link></td>
                                        <td id="movie-rating">{renderStars(review.stars)}</td>
                                        <td id="review-title">{review.review_title}</td>
                                        <td id="review-body">{review.review_body}</td>
                                        <td id="review-timestamp">{formatTimestamp(review.created_at)}</td>
                                        {parseInt(user.id) === parseInt(params.id) && <td>{checkReviewButton(review.id)}</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    )
}

export default ReviewsByUser