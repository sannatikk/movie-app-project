import React, { useEffect, useState } from 'react'
import { UseUser } from '../../context/UseUser.js'      // import hook to access user and token
import axios from 'axios'

export default function LeaveReview({ movieId, reviews, refreshReviews }) {

    const { user, token, readAuthorizationHeader } = UseUser()   // access the user and token from context
    const [review, setReview] = useState({ stars: 0, review_title: '', review_body: '' }); // initial review state
    const [error, setError] = useState(null)
    const [hasReviewed, setHasReviewed] = useState(false)

    const url = process.env.REACT_APP_API_URL

    // check if the user has already reviewed this movie
    useEffect(() => {
        if (user.id && reviews.length > 0) {
            const existingReview = reviews.find((r) => r.account_id === user.id)    // check if a review exists by this user
            setHasReviewed(!!existingReview)    // set true if a review by logged in user is found
        }
    }, [user.id, reviews])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const reviewData = {
            movie_id: movieId,
            user_id: user.id, // use the user ID from context
            stars: review.stars,
            review_title: review.review_title,
            review_body: review.review_body,
        }

        try {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
            const response = await axios.post(url + '/reviews', reviewData, { headers })
            await readAuthorizationHeader(response)    // update token if it is returned in the response
            setReview({ stars: 0, review_title: '', review_body: '' })
            alert('Review submitted successfully!');
            refreshReviews()

        } catch (err) {
            setError('Failed to submit the review. Please try again.')
            console.error(err)
        }
    }

    if (!user.id) return <p><i>You must be logged in to leave a review.</i></p>
    if (hasReviewed) return <p><i>You have already reviewed this movie. To leave a new review, please delete your existing review from your account page.</i></p>
    
    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form className="review-form" onSubmit={handleSubmit}>
                <div className="review-fields">

                    <div className="rating-field">
                        <label htmlFor="rating">Stars:</label>
                        <input
                            id="rating"
                            type="number"
                            placeholder="1-5"
                            min="1"
                            max="5"
                            value={review.stars || ""}
                            onChange={(e) => setReview({ ...review, stars: parseInt(e.target.value, 10) })}
                            required
                        />
                    </div>

                    <div className="review-title-field">
                        <label htmlFor="review_title">Review Title:</label>
                        <textarea
                            id="review_title"
                            value={review.review_title}
                            onChange={(e) => setReview({ ...review, review_title: e.target.value })}
                            required
                        ></textarea>
                    </div>
                </div>

                <div className="review-body-field">
                    <label htmlFor="review_body">Review Body:</label>
                    <textarea
                        id="review_body"
                        value={review.review_body}
                        onChange={(e) => setReview({ ...review, review_body: e.target.value })}
                        required
                    ></textarea>
                </div>

                {!user.id && <p><i>You must be logged in to leave a review.</i></p>}
                {hasReviewed && <p><i>You have already reviewed this movie. To leave a new review, please delete your existing review from your account page.</i></p>}

                <button type="submit" disabled={!user.id || hasReviewed}>
                    Submit Review
                </button>
            </form>
        </div>
    )

}