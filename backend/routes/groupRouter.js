import { Router } from 'express'
import { postGroup, getGroup, removeGroup } from '../controllers/GroupController.js'
import { auth } from '../helpers/auth.js'

const router = Router()

router.post('/', auth, postGroup)
router.get('/:id', getGroup)
router.delete('/:id', auth, removeGroup)


export default router