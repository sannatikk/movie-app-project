import { Router } from 'express'
import { getPinnedMovies, getPinnedShowtime, postPinnedMovie, postPinnedShow, removePinnedMovie, removePinnedShow } from '../controllers/PinnedController.js'
import { auth } from '../helpers/auth.js'

const router = Router()

router.post('/movie', auth, postPinnedMovie)      //group ID
router.get('/movie/:id', getPinnedMovies)       //group ID
router.delete('/movie/:id', auth, removePinnedMovie)    //pinned ID

router.post('/showtime/:id', auth, postPinnedShow)   //group ID
router.get('/showtime/:id', getPinnedShowtime)    //group ID
router.delete('/showtime/:id', auth, removePinnedShow) //pinned ID


export default router