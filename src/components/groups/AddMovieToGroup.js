import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { UseUser } from '../../context/UseUser.js'
import { fetchAllGroupsByUser } from '../../api/groupApi.js'
import { SectionHeader } from '../header/Header.js'

export default function AddMovieToGroup({ movie }) {
    const { user, token, readAuthorizationHeader } = UseUser()
    const [groups, setGroups] = useState([])
    const [selectedGroup, setSelectedGroup] = useState('')

    const url = process.env.REACT_APP_API_URL

    useEffect(() => {
        const getGroups = async () => {
            if (user.id) {
                try {
                    const userGroups = await fetchAllGroupsByUser(user.id)
                    const groups = userGroups.data.filter(group => group.pending === false) // check that user is accepted to group
                    setGroups(groups)
                } catch (error) {
                    console.error('Error fetching groups:', error)
                }
            }
        }
        getGroups()
    }, [user.id])

    const onGroupChange = (e) => {
        setSelectedGroup(e.target.value)
    }

    const handleAddMovie = async () => {
        if (!selectedGroup) {
            alert('Please select your group first.')
            return
        }
        try {
            const response = await axios.post(url + '/pinned/movie', {
                group_id: selectedGroup,
                movie_id: movie.id
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            await readAuthorizationHeader(response)

            if (response.status === 200) {
                alert('Movie added to group')
            }
        } catch (error) {
            if (error.status === 409) return alert('Movie already pinned to group.')
            alert('Failed to add movie to group. Please try again.')
        }
    }

    if (!user.id) {
        return (
            <div className="add-movie-to-group-container">
                <SectionHeader text='Pin Movie to Group' />
                <p><i>Log in to pin this movie to a group</i></p>
            </div>
        )
    }
    return (
        <>
            <div className="add-movie-to-group-container">
                <SectionHeader text='Pin Movie to Group' />
                <label> 
                    <select 
                        className="group-dropdown-menu"
                        value={selectedGroup} 
                        onChange={(e) => onGroupChange(e)}>
                        <option value=''>Select Group</option>
                        {groups.map(group => (
                            <option key={group.id} value={group.user_group_id}>{group.group_name}</option>
                        ))}
                    </select>
                </label>
                <button type='button' onClick={handleAddMovie}>Add Movie</button>
            </div>
        </>
    )
}