import React, {useEffect, useState} from 'react'
import { renderStars } from '../../utils/helperFunctions.js'
import { Link } from 'react-router-dom'

function ReviewByMovie ({reviews}) {

    const [sortedReviews, setSortedReviews] = useState([])

    useEffect(() => {
        const sorted = [...reviews].sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return dateB - dateA; // Compare dates: newest first
        })
        setSortedReviews(sorted);
    }, [reviews])   // run effect when reviews change

    return (
        <div>
            <h3>Reviews by Our Members</h3>

            {reviews.length === 0 ? (
                <p>No reviews available.</p>
            ) : (
                <div className="reviews-container">
                    {sortedReviews.map((review) => (
                        <div key={review.id} className="highlight-box review-box">
                            <div className="review-item">
                                {renderStars(review.stars)}
                            </div>
                            <div className="review-item">
                                <strong>{review.review_title}</strong>
                            </div>
                            <div className="review-item">
                                {review.review_body}
                            </div>
                            <div className="review-item">
                                <i>Review by <Link to={`/account/${review.account_id}`}>{review.uname}</Link></i>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ReviewByMovie