import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { renderStars, formatTimestamp } from '../../utils/helperFunctions.js'

function ReviewList({ reviews, movies }) {
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' }) // sort by created_at in descending order by default
    const [filterText, setFilterText] = useState('') // state to hold the filter input

    const sortedReviews = [...reviews].sort((a, b) => {
        let aValue, bValue

        if (sortConfig.key === 'movie_title') {
            // get the movie title for sorting
            aValue = movies[a.movie_id] || ''
            bValue = movies[b.movie_id] || ''
        } else {
            // default sorting based on review fields
            aValue = a[sortConfig.key]
            bValue = b[sortConfig.key]
        }

        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
    })

    const requestSort = (key) => {
        let direction = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }


    const filteredReviews = sortedReviews.filter(
        (review) =>
            review.review_body.toLowerCase().includes(filterText.toLowerCase()) ||
            review.review_title.toLowerCase().includes(filterText.toLowerCase()) ||
            review.uname.toLowerCase().includes(filterText.toLowerCase()) ||
            (movies[review.movie_id]?.toLowerCase().includes(filterText.toLowerCase()) || '')
    )

    return (
        <div>
            {reviews.length === 0 ? (
                <p>No reviews available.</p>
            ) : (
                <div>

                    {/* filter input */}
                    <div className="filter-container">
                        <input
                            type="text"
                            placeholder="Search reviews"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            className="filter-input"
                        />
                    </div>

                    {/* table for larger screens */}
                    <div className="review-table-container">
                        <table className="highlight-box">
                            <thead>
                                <tr>
                                    <th onClick={() => requestSort('movie_title')}>Movie Title</th>
                                    <th onClick={() => requestSort('stars')}>Stars</th>
                                    <th onClick={() => requestSort('uname')}>Reviewer</th>
                                    <th>Title</th>
                                    <th>Review</th>
                                    <th onClick={() => requestSort('created_at')}>Time Reviewed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReviews.map((review) => (
                                    <tr key={review.id}>
                                        <td>
                                            {movies[review.movie_id] ? (
                                                <Link to={`/movie/${review.movie_id}`}>
                                                    {movies[review.movie_id] || 'Unable to Fetch Title'}
                                                </Link>
                                            ) : (
                                                <span>Loading movie name...</span>
                                            )}
                                        </td>
                                        <td>{renderStars(review.stars)}</td>
                                        <td><Link to={`/account/${review.account_id}`}>{review.uname}</Link></td>
                                        <td>{review.review_title}</td>
                                        <td>{review.review_body}</td>
                                        <td>{formatTimestamp(review.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* card layout for smaller screens */}
                    <div className="review-cards">
                        {filteredReviews.map((review) => (
                            <div key={review.id} className="review-card highlight-box">
                                <h3><Link to={`/movie/${review.movie_id}`}>{movies[review.movie_id] || 'Unable to Fetch Title'}</Link>: {review.review_title}</h3>
                                <p>{renderStars(review.stars)}</p>
                                <p>{review.review_body}</p>
                                <p><i>Reviewed by <Link to={`/account/${review.account_id}`}>{review.uname}</Link></i></p>
                                <p><i>{formatTimestamp(review.created_at)}</i></p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReviewList