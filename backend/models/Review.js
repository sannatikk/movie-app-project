import { pool } from '../helpers/db.js'

const selectAllReviews = async () => {
    return await pool.query('Select review.id,review.account_id,review.movie_id,review.review_title,review.review_body,review.stars, review.created_at, account.uname from review INNER JOIN account ON review.account_id = account.id')
}

const selectAllReviewsByUser = async (user_id) => {
    return await pool.query('Select review.id,review.account_id,review.movie_id,review.review_title,review.review_body,review.stars, review.created_at, account.uname  from review INNER JOIN account ON review.account_id = account.id where review.account_id = $1', [user_id])
}

const selectAllReviewsByMovie = async (movie_id) => {
    return await pool.query('Select review.id,review.account_id,review.movie_id,review.review_title,review.review_body,review.stars, review.created_at, account.uname  from review INNER JOIN account ON review.account_id = account.id where review.movie_id = $1', [movie_id])
}

const insertReview = async (user_id, movie_id, review_title, review_body, stars) => {
    return await pool.query(
        'INSERT INTO review (account_id, movie_id, review_title, review_body, stars) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [user_id, movie_id, review_title, review_body, stars]
    );
};

const deleteReview = async (review_id) => {
    return await pool.query('delete from review WHERE id = $1', [review_id])
}


export { selectAllReviews, selectAllReviewsByUser, selectAllReviewsByMovie, insertReview, deleteReview }