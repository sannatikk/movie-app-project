import React from 'react'
import { Link } from 'react-router-dom'

function MovieList({ movies, title }) {
    if (!movies || movies.length === 0) {
        return <p>No movies found.</p>
    }

    return (
        <div>
            <center>
                <br /><h2>{title}</h2>  {/* Dynamically set the title */} <br />
                <div className="movie-grid">
                    {movies.map((movie) => (
                        <div key={movie.id} className="movie-item highlight-box">
                            <h3>
                                <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
                            </h3>
                            <img 
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                                alt={movie.title} 
                                className="movie-poster"
                            /> 
                            <p>Release Date: {movie.release_date}</p>
                            {movie.title !== movie.original_title && (
                                <p>Original Title: {movie.original_title}</p>
                            )}
                        </div>
                    ))}
                </div>
            </center>
        </div>
    )
}

export default MovieList