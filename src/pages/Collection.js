import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchCollection } from '../api/fetchTMDB.js'
import CollectionDetails from '../components/movies/CollectionDetails.js'
import './Collection.css'

function Collection() {
    const { id } = useParams();  // collection ID from URL
    const [collection, setCollection] = useState(null);  // state to store movie data
    const [loading, setLoading] = useState(true);  // state to manage loading state
    const [error, setError] = useState(null);  // state to handle errors

    useEffect(() => {
        const getCollection = async () => {
            try {
                const data = await fetchCollection(id)  // fetch movie data
                if (data.success === false) {
                    throw new Error(data.status_message || 'An unknown error occurred')
                }
                setCollection(data)  // set the movie data in state
            } catch (error) {
                setError(error.message)
                console.error('Error fetching movie:', error)
            } finally {
                setLoading(false)
            }
        };
        getCollection()  // call function to fetch movie data
    }, [id])

    if (loading) {
        return <h3>Loading...</h3>  // message while fetching
    }

    if (error) {
        return <h3>Error: {error}</h3>
    }

    return (
        <div>
            {collection && <CollectionDetails collection={collection} />}  {/* pass collection data to CollectionDetails */}
        </div>
    )
}

export default Collection