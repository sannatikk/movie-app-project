import { Router } from 'express'
import { getAllGroups, getAllUsersByGroup } from '../controllers/GroupController.js'

const router = Router()

router.get('/', getAllGroups)
router.get('/:id', getAllUsersByGroup)

export default router