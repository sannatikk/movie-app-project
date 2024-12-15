import { hash, compare } from 'bcrypt'
import { insertUser, selectUserByUsername, deleteUserById, selectAllGroupsByUser, insertInvite, deleteInvite, updateInvite, selectAllUsersToMembers, selectUsernameById } from '../models/User.js'
import { ApiError } from '../helpers/ApiError.js'
import jwt from 'jsonwebtoken'

const { sign } = jwt

// Add user to database
// NOTE: if error messages are changed, make sure to update the tests in UserController.test.js to match!!
const postRegistration = async (req, res, next) => {
    try {
        // Username validation
        if (!req.body.username || req.body.username.length === 0) return next(new ApiError('Invalid username', 400))    // Input for username is empty
        if (req.body.username.length > 25) return next(new ApiError('Username is too long', 400))    // Input for username is too long
        if (/\s/.test(req.body.username)) return next(new ApiError('Username cannot contain spaces', 400))    // Username contains spaces

        // Password validation
        if (!req.body.password || req.body.password.length < 8) return next(new ApiError('Password length must be at least 8 characters', 400))     // Input for password is too short
        if (req.body.password.match(/^(?=.*[A-Z])(?=.*[0-9])/) === null) return next(new ApiError('Password must include at least one uppercase letter and one number', 400))
        if (req.body.password === req.body.username) return next(new ApiError('Username and password must be different', 400))    // Username and password are the same

        // Check if user exists
        const userExists = await selectUserByUsername(req.body.username)
        if (userExists.rowCount > 0) return next(new ApiError('Username already exists', 400))

        const hashedPassword = await hash(req.body.password, 10)
        const userFromDb = await insertUser(req.body.username, hashedPassword)
        const user = userFromDb.rows[0]
        return res.status(201).json(createUserObject(user.id, user.username))
    } catch (error) {
        return next(error)
    }
}

// Create UserObject
const createUserObject = (id, username, token = undefined) => {
    return {
        'id': id,
        'username': username,
        ...(token !== undefined) && { 'token': token }
    }
}

// Login
// NOTE: if error messages are changed, make sure to update the tests in UserController.test.js to match!!
const postLogin = async (req, res, next) => {
    const invalid_credentials_message = 'Invalid username or password'
    try {
        const userFromDb = await selectUserByUsername(req.body.username)
        if (userFromDb.rowCount === 0) return next(new ApiError(invalid_credentials_message), 401)   // User not found

        const user = userFromDb.rows[0]
        if (!await compare(req.body.password, user.password)) return next(new ApiError(invalid_credentials_message, 401))  // Passwords do not match

        const token = sign({ username: req.body.username}, process.env.JWT_SECRET_KEY, {expiresIn: '12h'})
        return res
        .header('Access-Control-Expose-Headers', 'Authorization')
        .header('Authorization', 'Bearer ' + token)     // Set token in header
        .status(200)
        .json(createUserObject(user.id, user.uname))
    } catch (error) {
        return next(error)
    }
}

//Get all groups for specific user_id
const getAllGroupsByUser = async (req, res, next) => {
    try {
        const response = await selectAllGroupsByUser(req.params.id)
        return res.status(200).json(response.rows);
    } catch (error) {
        console.log(error)
    }
}

// Delete user
// NOTE: if error messages are changed, make sure to update the tests in UserController.test.js to match!!
const deleteUser = async (req, res, next) => {
    const invalid_password_message = 'Incorrect password'

    try {
        const id = parseInt(req.body.id)
        const userFromDb = await selectUserByUsername(req.body.username)
        const user = userFromDb.rows[0]
        const result = await compare(req.body.password, user.password)
        if (result) {
            return res.status(200).json(await deleteUserById(id))
        }
        return next(new ApiError(invalid_password_message, 401))  // Passwords do not match

    } catch (error) {
        console.log(error)
    }
}

const postInvite = async (req, res, next) => {
    try {
        const response = await insertInvite(req.body.account_id, req.body.group_id)
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error)
    }
}
// accept invite updates pending status to false
const acceptInvite = async (req, res, next) => {
    try {
        const response = await updateInvite(req.params.id)
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error)
    }
}

// deletes invite
const declineInvite = async (req, res, next) => {
    try {
        const response = await deleteInvite(req.params.id)
        return res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error)
    }
}

// Member list
const getAllUsersToMembers = async (req, res, next) => {
    try {
        const response = await selectAllUsersToMembers()
        if (!response.rows.length === 0) {
            return res.status(404).json({ message: 'No users found' })
        }
        return res.status(200).json(response.rows)
    } catch (error) {
        console.log(error)
        return next(error)
    }

}

const getUsernameById = async (req, res, next) => {
    try {
        const response = await selectUsernameById(req.params.id)
        return res.status(200).json(response.rows)
    } catch (error) {
        console.log(error)
        return next(error)
    }
}

export { postRegistration, postLogin, deleteUser, getAllGroupsByUser, postInvite, acceptInvite, declineInvite, getAllUsersToMembers, getUsernameById }
