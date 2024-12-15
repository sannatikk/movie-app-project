import './Group.css'
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { UseUser } from '../context/UseUser.js'
import { fetchMovieById } from '../api/fetchTMDB.js'
import { MainHeader } from '../components/header/Header.js'
import { fetchGroupMembers, fetchAllGroupsByUser, fetchGroupById, fetchGroupMovies } from '../api/groupApi.js'
import GroupDescription from '../components/groups/GroupDescription.js'
import GroupMembers from '../components/groups/GroupMembers.js'
import GroupMovies from '../components/groups/GroupMovies.js'
import GroupShowtimes from '../components/groups/GroupShowtimes.js'
import './Group.css'

/* Group page
Only registered and logged in users can enter to group page
Group page contains group details, members, pinned movies and pinned showtimes
Group owner can delete group, remove users, movies and pinned showtimes from group
Group owner can accept or decline join invitations other from users
*/

export default function Group() {
    const { user, token, readAuthorizationHeader } = UseUser()
    const { id } = useParams() // group_id from URL
    const [isOwner, setIsOwner] = useState(false)
    const [group, setGroup] = useState(' ')
    const [groupUsers, setGroupUsers] = useState([])
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const url = process.env.REACT_APP_API_URL

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Get group members
                const membersResponse = await fetchGroupMembers(id)
                setGroupUsers(membersResponse)

                // Get group details
                const groupResponse = await fetchGroupById(id)
                setGroup(groupResponse)

                // Check if user is group owner
                if (groupResponse.owner_id === user.id) {
                    setIsOwner(true)
                }

                // If user is not in group or not logged in, redirect to error page
                if (!token || !membersResponse.some(member => member.account_id === user.id)) {
                    navigate('/error')
                }
            } catch (err) {
                console.error('Error loading group data:', err)
                setError('Failed to load group data')
            } finally {
                setLoading(false)
            }
        }

        // Check that user is logged in and group id is valid
        if (token && id) {
            fetchInitialData()
        } else {
            navigate('/error')
        }
    }, [id, token, user.id, navigate])

    // Get group details
    const getGroupData = useCallback(async () => {
        try {
            const response = await fetchGroupById(id)
            setGroup(response)
        } catch (error) {
            console.log(error)
            setError('Failed to load group data')
        }
    }, [id])

    // Get all users in group
    const getGroupMembers = useCallback(async () => {
        try {
            const response = await fetchGroupMembers(id)
            setGroupUsers(response)
        } catch (error) {
            console.log(error)
            setError('Failed to load group members')
        }
    }, [id])

    // Get all movie id's in group and fetch movie details
    const getGroupMovies = useCallback(async () => {
        try {
            const response = await fetchGroupMovies(id)
            const movieDetails = await Promise.all(
                response.data.map(async (movie) => {
                    const movieData = await fetchMovieById(movie.movie_id)
                    const { id, title } = movieData
                    return { id, title }
                })
            )
            setMovies(movieDetails)
        } catch (error) {
            console.log(error)
            setError('Failed to load movies')
        }
    }, [id])

    // Delete group
    const handleDeleteGroup = async () => {
        // Confirm group deletion
        const confirmDelete = window.confirm('Are you sure you want to delete this group?')
        if (!confirmDelete) return
        try {
            const response = await axios.delete(url + '/group/' + id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            await readAuthorizationHeader(response)
            navigate('/groups')
            return response
        } catch (error) {
            console.log(error)
            setError('Failed to delete group')
        }
    }

    // Handle Accept user
    const handleAcceptUser = async (userId) => {
        try {
            const userGroups = await fetchAllGroupsByUser(userId) // Returns all groups for user
            const group = userGroups.data.find(group => String(group.user_group_id) === String(id)) // This group
            //await acceptInvite(group.id) // Remove user from group by account_user_group table id (relation table)
            const response = await axios.put(url + '/user/invite/' + group.id, {}, {    // PUT method needs empty body as second parameter
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            await readAuthorizationHeader(response)
            getGroupMembers()  // Refresh members
        } catch (error) {
            console.log(error)
            setError('Failed to accept user to group')
        }
    }

    // Handle remove user from group
    const handleRemoveUser = async (userId) => {
        try {
            const userGroups = await fetchAllGroupsByUser(userId) // Returns all groups for user
            const group = userGroups.data.find(group => String(group.user_group_id) === String(id)) // This group
            //await removeUserFromGroup(group.id) // Remove user from group by account_user_group table id (relation table)
            const response = await axios.delete(url + '/user/invite/' + group.id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            await readAuthorizationHeader(response)
            getGroupMembers()  // Refresh members
        } catch (error) {
            console.log(error)
            setError('Failed to remove user from group')
        }
    }

    // Handle remove movie from group
    const handleRemoveMovie = async (movieId) => {
        try {
            const pinnedMovies = await axios.get(url + '/pinned/movie/' + id)
            const pinnedMovie = pinnedMovies.data.find(movie => movie.movie_id === movieId)
            const response = await axios.delete(url + '/pinned/movie/' + pinnedMovie.id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            await readAuthorizationHeader(response)

            getGroupMovies()    // Refresh movies
        } catch (error) {
            console.log(error)
            setError('Failed to remove movie from group')
        }
    }

    useEffect(() => {
        getGroupData()
        getGroupMembers()
        getGroupMovies()
    }, [getGroupData, getGroupMembers, getGroupMovies])

    if (loading) {
        return <h3>Loading...</h3>
    }

    if (error) {
        return <h3>{error}</h3>
    }

    return (
        <div className='group-page'>
            <MainHeader text={group.group_name} />
            <GroupDescription description={group.description} />
            <GroupMembers groupUsers={groupUsers} isOwner={isOwner} ownerId={group.owner_id} onRemoveUser={handleRemoveUser} onAcceptUser={handleAcceptUser} />
            <GroupMovies movies={movies} onRemoveMovie={handleRemoveMovie} />
            <GroupShowtimes group_id={id} />
            {isOwner && <button type='button' className="major-delete-button" onClick={handleDeleteGroup}>Delete Group</button>}
        </div >
    )
}