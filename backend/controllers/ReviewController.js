import { ApiError } from '../helpers/ApiError.js'
import { selectAllReviews, selectAllReviewsByUser, selectAllReviewsByMovie, insertReview, deleteReview } from '../models/Review.js'

const getAllReviews = async (req, res, next) => {
    try {
        const response = await selectAllReviews()
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error)
    }
}

const getAllReviewsByUser = async (req, res, next) => {
    try {
        const response = await selectAllReviewsByUser(req.params.id)
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error)
    }
}

const getAllReviewsByMovie = async (req, res, next) => {
    try {
        const response = await selectAllReviewsByMovie(req.params.id)
        return res.status(200).json(response.rows);
    } catch (error) {
        console.log(error)
    }
}

const postReview = async (req, res, next) => {
    try {
        const { user_id, movie_id, review_title, review_body, stars } = req.body;

        if (!user_id || !movie_id || !review_title || !review_body || stars == null) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const response = await insertReview(user_id, movie_id, review_title, review_body, stars);
        return res.status(200).json(response.rows)
    } catch (error) {
        next(error)
    }
}

const removeReview = async (req, res, next) => {
    try {
        const response = await deleteReview(req.params.id)
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error)
    }
}


export { getAllReviews, getAllReviewsByUser, getAllReviewsByMovie, postReview, removeReview }