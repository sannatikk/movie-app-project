import { pool } from '../helpers/db.js'


const selectAllFavoritesByUser = async (user_id) => {
    return await pool.query(`Select favorite.id,favorite.account_id,favorite.movie_id, favorite.movie_name, account.uname  
        from favorite 
        INNER JOIN account 
        ON favorite.account_id = account.id where favorite.account_id = $1`, [user_id])
}
const insertFavorite = async (account_id, movie_id, movie_name) => {
    return await pool.query(`
        insert into favorite (account_id, movie_id, movie_name) 
        values ($1, $2, $3) returning *`, [account_id, movie_id, movie_name])
}

const deleteFavorite = async (favorite_id) => {
    return await pool.query(`
        DELETE  
        FROM favorite
        WHERE id = $1 returning *`, [favorite_id])
}


export { selectAllFavoritesByUser, insertFavorite, deleteFavorite }