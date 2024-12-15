import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { SectionHeader } from '../header/Header.js'
import { fetchFinnkinoDataById } from '../../api/fetchFinnkino.js'
import { UseUser } from '../../context/UseUser.js'

export default function GroupShowtimes({ group_id }) {
    const [showtimes, setShowtimes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { token, readAuthorizationHeader } = UseUser()

    const url = process.env.REACT_APP_API_URL

    useEffect(() => {
        const fetchShowtimes = async () => {
            if (!group_id) return

            try {
                const response = await fetchFinnkinoDataById(group_id, token)

                if (Array.isArray(response)) {
                    setShowtimes(response)
                } else {
                    console.error('Error fetching showtimes:', response)
                    setShowtimes([])
                }

                setError(null)
                setLoading(false)
            } catch (error) {
                setError('Failed to fetch showtimes')
                setLoading(false)
            }
        }
        fetchShowtimes()
    }, [group_id, token])

    const handleDeleteShowtime = async (showtime_id) => {
        try {
            const response = await axios.delete(url + '/pinned/showtime/' + showtime_id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                await readAuthorizationHeader(response)
                setShowtimes(showtimes.filter(showtime => showtime.id !== showtime_id))
            }
        } catch (error) {
            console.error('Error deleting showtime:', error)
        }
    }

    if (loading) return (
        <>
            <SectionHeader text="Pinned Showtimes" />
            <p><i>Loading pinned showtimes...</i></p>
        </>
    )

    if (error) return (
        <>
            <SectionHeader text="Pinned Showtimes" />
            <p>{error}</p>
        </>
    )

    if (showtimes.length === 0) return (
        <>
            <SectionHeader text="Pinned Showtimes" />
            <div className="group-section-container">
                <p><i>This group has not pinned any showtimes!</i></p>
            </div>
        </>
    )

    return (
        <div className="group-showtimes">
            <SectionHeader text="Pinned Showtimes" />
            <div className="group-section-container">

                <table className="group-showtime-table highlight-box">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Theater</th>
                            <th>Auditorium</th>
                            <th>Movie</th>
                            <th>Unpin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(showtimes) && showtimes.map((showtime, index) => (
                            <tr key={index}>
                                <td>{showtime.showDate}</td>
                                <td>{showtime.showTime}</td>
                                <td>{showtime.theatreName}</td>
                                <td>{showtime.theatreAuditorium}</td>
                                <td>{showtime.movieName}</td>
                                
                                <td>
                                    <button
                                        type='button'
                                        onClick={() => handleDeleteShowtime(showtime.id)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="group-showtime-grid">
                {Array.isArray(showtimes) && showtimes.map((showtime, index) => (
                    <div key={index} className="group-showtime-card highlight-box">
                        <p><strong>Movie:</strong> {showtime.movieName}</p>
                        <p><strong>Date:</strong> {showtime.showDate}</p>
                        <p><strong>Time:</strong> {showtime.showTime}</p>
                        <p><strong>Theater:</strong> {showtime.theatreName}</p>
                        <p><strong>Auditorium:</strong> {showtime.theatreAuditorium}</p>
                        <button
                            type='button'
                            onClick={() => handleDeleteShowtime(showtime.id)}
                            className="delete-button">
                            Unpin
                        </button>
                    </div>
                ))}
            </div>

            </div>
        </div>
    )
}