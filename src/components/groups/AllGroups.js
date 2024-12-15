import React, { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { Link } from 'react-router-dom'
import { fetchAllGroupsByUser } from "../../api/groupApi.js"
import { UseUser } from "../../context/UseUser.js"

// Return all groups in a list
export default function AllGroups({ groups }) {
    const { user, token, readAuthorizationHeader } = UseUser()
    const [userGroups, setUserGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const url = process.env.REACT_APP_API_URL

    // Get all groups that user belongs to
    const fetchGroupMemberships = useCallback(async () => {
        try {
            if (!user.id) return
            const response = await fetchAllGroupsByUser(user.id) // Get all groups for user 
            const filteredGroups = response.data.map(group => ({
                invite_id: group.id,
                account_id: group.account_id,
                group_id: group.user_group_id,
                pending: group.pending
            }))
            setUserGroups(filteredGroups)
        } catch (error) {
            setError('Failed to fetch group memberships')
        } finally {
            setLoading(false)
        }
    }, [user.id])

    //Add button by state of user in group
    const selectButton = (group_id, owner_id) => {
        if (!user.id) return
        const group = userGroups.find(group => group.group_id === group_id)
        if (user.id === owner_id) return <span><button disabled>Owner cannot leave group</button></span>
        if (group) {
            if (group.pending === true) {
                return <button type="button" onClick={() => handleLeaveButton(group.invite_id)}>Cancel Request</button> // Request sent
            }
            return <button type="button" onClick={() => handleLeaveButton(group.invite_id)}>Leave Group</button> // User belongs to group
        }
        return <button type="button" onClick={() => handleJoinButton(group_id)}>Join Group</button> // User doesnt belong to group
    }

    // Add user to group
    const handleJoinButton = async (group_id) => {

        // Join group as user
        try {
            const response = await axios.post(url + '/user/invite', {
                account_id: user.id,
                group_id: group_id
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            await readAuthorizationHeader(response)

            setUserGroups([...userGroups, { account_id: user.id, group_id: group_id, pending: true }])
            fetchGroupMemberships() // Update user groups
            return response
        } catch (error) {
            return error.message
        }
    }

    // Remove user from group
    const handleLeaveButton = async (invite_id) => {
        try {
            const response = await axios.delete(url + '/user/invite/' + invite_id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            await readAuthorizationHeader(response)

            setUserGroups((prevGroups) => prevGroups.filter(group => group.invite_id !== invite_id))
            fetchGroupMemberships() // Update user groups
            return response
        } catch (error) {
            if (error.response.status === 403) return alert('Owner cannot leave group.')
            return error.message
        }
    }

    useEffect(() => {
        fetchGroupMemberships() // Get all groups for user
    }, [groups, fetchGroupMemberships])

    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>

    return (
        <div>
            {!user.id && <p><i>You must be logged in to join groups.</i></p>}
            <div className="groups-grid">
                {groups.map((group) => (
                    <div key={group.id} className="group-card highlight-box">
                        <h3>
                            {userGroups.some(
                                (userGroup) => userGroup.group_id === group.id && !userGroup.pending
                            ) ? (
                                <Link to={`/group/${group.id}`}>{group.group_name}</Link>
                            ) : (
                                group.group_name
                            )}
                        </h3>
                        <p>{group.description}</p>
                        <div className="group-actions">{selectButton(group.id, group.owner_id)}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}