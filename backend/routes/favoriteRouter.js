import { Router } from 'express'
import { getAllFavoritesByUser, postFavorite, removeFavorite } from '../controllers/FavoriteController.js'
import { auth } from '../helpers/auth.js'

const router = Router()

router.post('/', auth, postFavorite)
router.get('/:id', getAllFavoritesByUser)
router.delete('/:id', auth, removeFavorite)


export default router