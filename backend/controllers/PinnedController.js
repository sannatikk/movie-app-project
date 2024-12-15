import { ApiError } from '../helpers/ApiError.js'
import { selectPinnedMovies, selectPinnedShow, insertPinnedMovie, insertPinnedShow, deletePinnedMovie, deletePinnedShow } from '../models/Pinned.js'


const getPinnedMovies = async (req, res, next) => {
    try {
        const response = await selectPinnedMovies(req.params.id)
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error)
    }
}
const getPinnedShowtime = async (req, res, next) => {
    try {
        const response = await selectPinnedShow(req.params.id)
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error)
    }
}

const postPinnedMovie = async (req, res, next) => {
    try {
        const response = await insertPinnedMovie(req.body.group_id, req.body.movie_id)
        return res.status(200).json(response.rows);
    }
    catch (error) {
        if (error.code === '23505') {
            return next(new ApiError('Movie already added to selected group', 409))
        }
    }
}
const postPinnedShow = async (req, res, next) => {
    try {
        const response = await insertPinnedShow(req.params.id, req.body.movie_id, req.body.area_id, req.body.date)
        return res.status(200).json(response.rows);
    }
    catch (error) {
        if (error.code === '23505') {
            return next(new ApiError('Showtime already added to group', 409))
        }
    }
}

const removePinnedMovie = async (req, res, next) => {
    try {
        const response = await deletePinnedMovie(req.params.id)
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error)
    }
}

const removePinnedShow = async (req, res, next) => {
    try {
        const response = await deletePinnedShow(req.params.id)
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error)
    }
}

export { getPinnedMovies, getPinnedShowtime, postPinnedMovie, postPinnedShow, removePinnedMovie, removePinnedShow }