import { pool } from '../helpers/db.js'

// Insert user
const insertUser = async (username, hashedPassword) => {
    return await pool.query('insert into account (uname, password) values ($1, $2) returning *', [username, hashedPassword])
}

// Select user by username
const selectUserByUsername = async (username) => {
    return await pool.query('select * from account where uname=$1', [username])
}

// Delete user by id, this delete also automatically favourites and reviews by user
const deleteUserById = async (id) => {
    return await pool.query('delete from account where id=$1 returning *', [id])
}

// Select all groups by user
const selectAllGroupsByUser = async (user_id) => {
    return await pool.query('Select * from user_group INNER JOIN account_user_group ON user_group.id = account_user_group.user_group_id WHERE account_user_group.account_id = $1', [user_id])
}




// Below are the functions for the invite system and should maybe be moved to a separate file or to group controller
const insertInvite = async (account_id, group_id) => {
    return await pool.query('insert into account_user_group(account_id, user_group_id) values ($1,$2)', [account_id, group_id])
}

const updateInvite = async (invite_id) => {
    return await pool.query('update account_user_group SET pending = FALSE WHERE id = $1',[invite_id])
}

const deleteInvite = async (invite_id) => {
    return await pool.query('DELETE from account_user_group WHERE id = $1', [invite_id])
}

// members list
const selectAllUsersToMembers = async () => {
    return await pool.query('SELECT id, uname FROM account')
}

const selectUsernameById = async (id) => {
    return await pool.query('SELECT uname FROM account WHERE id = $1', [id])
}
export { insertUser, selectUserByUsername, deleteUserById, selectAllGroupsByUser, insertInvite, updateInvite, deleteInvite, selectAllUsersToMembers, selectUsernameById }
