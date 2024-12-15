// pages/Home.js
import React, { useState, useEffect } from 'react'
import { MainHeader, SectionHeader } from '../components/header/Header.js'
import { fetchMoviesByYear, fetchMoviesByLanguage, fetchMoviesByGenre, fetchMoviesByTerm, fetchCurrentMovies } from '../api/fetchTMDB'
import MovieList from '../components/movies/MovieList.js'
import GenreSelect from '../components/movies/GenreSelect.js'
import './Home.css'

function Home() {
    const [term, setTerm] = useState('')
    const [year, setYear] = useState('')
    const [language, setLanguage] = useState('')
    const [genre, setGenre] = useState('')
    const [movies, setMovies] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isInitialLoad, setIsInitialLoad] = useState(true)  // Track if it's the first load

    const handleSearch = async (fetchFunction, params = {}) => {
        setLoading(true)
        setError(null)
        try {
            const data = await fetchFunction(params)
            if (data.results) {
                setMovies(data.results)
            } else {
                setError('No movies found.')
            }
        } catch (error) {
            setError('Error fetching movies. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Use useEffect to trigger the search when the page is first loaded
    useEffect(() => {
        handleSearch(fetchCurrentMovies)  // Load top movies on first load
    }, []);  // Empty dependency array ensures this runs only once when the component mounts

    // Update isInitialLoad when a search is performed
    const handleSearchWithParams = (fetchFunction, params) => {
        setIsInitialLoad(false)  // After first load, it's not the initial load anymore
        handleSearch(fetchFunction, params)
    }

    return (
        <div className="home-page">
            <MainHeader text="Movie Finder" />
            <SectionHeader text="Search for Movies" />

            {/* Search form in table format */}
            <table className="movie-search-table">
                <tbody>
                    <tr>
                        <td><label>Name:</label></td>
                        <td><input
                            type="text"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            placeholder="e.g. Apocalypse Now"
                        /></td>
                        <td><button
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault()
                                handleSearchWithParams(fetchMoviesByTerm, term)
                                setTerm('')
                            }}
                        >Search</button></td>
                    </tr>
                </tbody>
            </table>
            
            <SectionHeader text="Or browse by:" />

            <table className="movie-browse-table">
                <tbody>
                    <tr>
                        <td><label>Year:</label></td>
                        <td><input
                            type="text"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            placeholder="e.g. 2021"
                        /></td>
                        <td><button
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault()
                                handleSearchWithParams(fetchMoviesByYear, year)
                                setYear('')
                            }}
                        >Search</button></td>
                    </tr>
                    <tr>
                        <td><label>Language code:</label></td>
                        <td><input
                            type="text"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            placeholder="e.g. 'sv' for Swedish"
                        /></td>
                        <td><button
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault()
                                handleSearchWithParams(fetchMoviesByLanguage, language)
                                setLanguage('')
                            }}
                        >Search</button></td>
                    </tr>
                    <tr>
                        <td><label>Genre:</label></td>
                        <td><GenreSelect
                            selectedGenre={genre}
                            onGenreChange={setGenre}
                        /></td>
                        <td><button
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault()
                                handleSearchWithParams(fetchMoviesByGenre, genre)
                                setGenre('')
                            }}
                        >Search</button></td>
                    </tr>
                </tbody>
            </table>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Conditionally render the title based on isInitialLoad */}
            <MovieList movies={movies} title={isInitialLoad ? "Top 20 Current Movies" : "Top 20 Search Results"} />
        </div>
    )
}

export default Home