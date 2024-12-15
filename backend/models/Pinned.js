import { pool } from '../helpers/db.js'


const selectPinnedMovies = async (group_id) => {
    return await pool.query('Select * from pinnedmovie where group_id = $1', [group_id])
}
const selectPinnedShow = async (group_id) => {
    return await pool.query('Select * from pinnedshow where group_id = $1 ORDER BY showdate ASC', [group_id])
}

const insertPinnedMovie = async (group_id, movie_id) => {
    return await pool.query('insert into pinnedmovie (group_id, movie_id) values ($1, $2) returning *', [group_id, movie_id])
}

const insertPinnedShow = async (group_id, movie_id, area_id, showdate) => {
    return await pool.query('insert into pinnedshow (group_id, movie_id, area_id, showdate) values ($1, $2, $3, $4) returning *', [group_id, movie_id, area_id, showdate])
}

const deletePinnedMovie = async (pinned_id) => {
    return await pool.query('delete from pinnedmovie WHERE id = $1 returning *', [pinned_id])
}

const deletePinnedShow = async (pinned_id) => {
    return await pool.query('delete from pinnedshow WHERE id = $1 returning *', [pinned_id])
}

export { selectPinnedMovies, selectPinnedShow, insertPinnedMovie, insertPinnedShow, deletePinnedMovie, deletePinnedShow }