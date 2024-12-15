import { pool } from '../helpers/db.js'

// Select all groups
const selectAllGroups = async () => {
    return await pool.query('select * from user_group')
}

// Select group by id
const selectGroup = async (group_id) => {
    return await pool.query('select * from user_group where id = $1', [group_id])
}

// Select all users by group id
const selectAllUsersByGroup = async (group_id) => {
    return await pool.query('select account_user_group.account_id, account_user_group.user_group_id, account_user_group.pending, account.uname from account INNER JOIN account_user_group ON account.id = account_user_group.account_id INNER JOIN user_group ON account_user_group.user_group_id = user_group.id WHERE user_group.id = $1', [group_id])
}

/*// Insert group
const insertGroup = async (group_name, user_id, description) => {
    return await pool.query('insert into user_group (group_name, owner_id, description) values ($1, $2, $3) returning *', [group_name, user_id, description])
}*/
const insertGroup = async (group_name, user_id, description) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const groupResult = await client.query(
            'INSERT INTO user_group (group_name, owner_id, description) VALUES ($1, $2, $3) RETURNING id',
            [group_name, user_id, description]
        );
        const groupId = groupResult.rows[0].id;

        await client.query(
            'INSERT INTO account_user_group (account_id, user_group_id, pending) VALUES ($1, $2, FALSE)',
            [user_id, groupId]
        );

        await client.query('COMMIT');
        return groupResult.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// Delete group
const deleteGroup = async (group_id) => {
    return await pool.query('delete from user_group where id = $1 returning *', [group_id])
}

export { selectAllGroups, selectGroup, selectAllUsersByGroup, insertGroup, deleteGroup }