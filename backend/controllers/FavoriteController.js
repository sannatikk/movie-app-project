import { response } from 'express'
import { ApiError } from '../helpers/ApiError.js'
import { selectAllFavoritesByUser, insertFavorite, deleteFavorite } from '../models/Favorite.js'
import { pool } from '../helpers/db.js'

const getAllFavoritesByUser = async (req, res, next) => {
    try {
        const response = await selectAllFavoritesByUser(req.params.id)
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error)
    }
}

const postFavorite = async (req, res, next) => {
    try {
        const response = await insertFavorite(req.body.user_id, req.body.movie_id, req.body.movie_name)
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error)
        return next(error)
    }
}

const removeFavorite = async (req, res, next) => {
    try {
        const response = await deleteFavorite(req.params.id)
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error)
    }
}


export { getAllFavoritesByUser, postFavorite, removeFavorite }