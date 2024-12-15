import React from "react"
import { UseUser } from "../../context/UseUser.js"
import axios from 'axios'

export default function CreateGroupForm({ setGroups }) {
    const { user, token, readAuthorizationHeader } = UseUser()
    const [groupName, setGroupName] = React.useState('')
    const [groupDescription, setGroupDescription] = React.useState('')
    const [error, setError] = React.useState(null)

    const url = process.env.REACT_APP_API_URL

    if (!user.id) {
        return <div><i>You must be logged in to create a group.</i></div>
    }

    const handleCreateGroup = async (e) => {
        e.preventDefault()
        if (groupName === '' || groupDescription === '') {
            setError('Group name and description are required.')
            return
        }
        
        try {
            const response = await axios.post(url + '/group', {
                group_name: groupName,
                owner_id: user.id,
                group_description: groupDescription
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            setGroups((prevGroups) => [...prevGroups, { id: response.data.id, group_name: groupName, owner_id: user.id, description: groupDescription }])
            // Update token if it is returned in the response
            await readAuthorizationHeader(response)
            return response
        } catch (error) {
            return error.message
        } finally {
            setGroupName('')
            setGroupDescription('')
            setError(null)
        }
    }

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form className="create-group-form" onSubmit={handleCreateGroup}>
                <div className="group-fields">
                    <div className="group-name-field">
                        <label htmlFor="group_name">Group Name:</label>
                        <textarea
                            id="group_name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="group-description-field">
                        <label htmlFor="group_description">Group Description:</label>
                        <textarea
                            id="group_description"
                            value={groupDescription}
                            onChange={(e) => setGroupDescription(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <button type="submit">Create Group</button>
            </form>
        </div>
    )
}