import axios from "axios"
//import { apiClient } from "../services/apiClient"

const url = process.env.REACT_APP_API_URL

// Get all members in group
const fetchGroupMembers = async (groupId) => {
    try {
        const response = await axios(url + '/groups/' + groupId, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    } catch (error) {
        return error.message
    }
}

// Get group by id
const fetchGroupById = async (groupId) => {
    try {
        const response = await axios(url + '/group/' + groupId)
        return response.data[0]
    } catch (error) {
        return error.message
    }
}

// Get all groups
const fetchAllGroups = async () => {
    try {
        const response = await axios(url + '/groups', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })

        return response
    } catch (error) {
        return error.message
    }
}

// Get all groups for specific user_id
const fetchAllGroupsByUser = async (userId) => {
    try {
        const response = await axios(url + '/user/group/' + userId, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response
    } catch (error) {
        return error.message
    }
}

const fetchGroupMovies = async (groupId) => {
    try {
        const response = await axios(url + '/pinned/movie/' + groupId)
        return response
    } catch (error) {
        return error.message
    }
}


// Remove user from group
const removeUserFromGroup = async (invite_id) => {
    try {
        const response = await axios.delete(url + '/user/invite/' + invite_id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        return response
    } catch (error) {
        return error
    }
}

export { fetchGroupMembers, fetchGroupById, fetchAllGroups, fetchGroupMovies, fetchAllGroupsByUser, removeUserFromGroup }