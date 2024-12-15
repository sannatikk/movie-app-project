import { Router } from 'express'
import { getAllReviews, getAllReviewsByUser, getAllReviewsByMovie, postReview, removeReview } from '../controllers/ReviewController.js'
import { auth } from '../helpers/auth.js'

const router = Router()

router.post('/', auth, postReview)
router.get('/', getAllReviews)
router.get('/user/:id', getAllReviewsByUser)
router.get('/movie/:id', getAllReviewsByMovie)
router.delete('/:id', auth, removeReview)


export default router