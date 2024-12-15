import React from "react"
import { SectionHeader } from "../header/Header"
import { Link } from 'react-router-dom'

export default function GroupMembers({ groupUsers, isOwner, ownerId, onRemoveUser, onAcceptUser }) {

    return (
        <>
            <SectionHeader text='Members' />
            <div className="group-section-container">
                <table className="group-members-table">
                    <tbody>
                        {groupUsers.map((user) => (
                            <tr key={user.account_id}>
                                <td>{user.pending ? (
                                    <Link to={`/account/${user.account_id}`}>{user.uname} (Pending) </Link>
                                ) : (
                                    <Link to={`/account/${user.account_id}`}>{user.uname} </Link>
                                )}
                                </td>
                                <td>
                                    {isOwner && user.account_id !== ownerId && !user.pending && <button type='button' onClick={() => onRemoveUser(user.account_id)}>Remove</button>}
                                    {isOwner && user.pending &&
                                        <button type='button' onClick={() => onRemoveUser(user.account_id)}>Decline</button>}
                                    {isOwner && user.pending && <button type='button' onClick={() => onAcceptUser(user.account_id)}>Accept</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}