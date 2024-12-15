import { ApiError } from '../helpers/ApiError.js'
import { insertGroup, deleteGroup, selectAllGroups, selectGroup, selectAllUsersByGroup } from '../models/Group.js'

//add group to database
const postGroup = async (req, res, next) => {
    try {
        const response = await insertGroup(req.body.group_name, req.body.owner_id, req.body.group_description)
        return res.status(201).json(response);
    } catch (error) {
        console.log(error)
    }
}

//Get all groups
const getAllGroups = async (req, res, next) => {
    try {
        const response = await selectAllGroups()
        return res.status(200).json(response.rows);
    } catch (error) {
        console.log(error)
    }
}

//Get Specific group
const getGroup = async (req, res, next) => {
    try {
        const response = await selectGroup(req.params.id)
        return res.status(200).json(response.rows);
    } catch (error) {
        console.log(error)
    }
}

// Get user by group
const getAllUsersByGroup = async (req, res, next) => {
    try {
        const response = await selectAllUsersByGroup(req.params.id)
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error)
    }
}


const removeGroup = async (req, res, next) => {
    try {
        const response = await deleteGroup(req.params.id)
        return res.status(200).json(response.rows);
    } catch (error) {
        console.log(error)
    }
}

export { postGroup, getAllGroups, getGroup, getAllUsersByGroup, removeGroup }