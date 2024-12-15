import React from "react"
import { Link } from "react-router-dom"

function CollectionDetails({ collection }) {

    // sort movies by release date
      collection.parts.sort((a, b) => {
      const dateA = new Date(a.release_date);
      const dateB = new Date(b.release_date);
      return dateA - dateB; // oldest first
  })

    return (
        <div>

          <div className="collection-overview">
            <h1>{collection.name}</h1>
            <p>{collection.overview}</p>

            {collection.poster_path && (
                <img
                    src={`https://image.tmdb.org/t/p/w500${collection.poster_path}`}
                    alt={collection.name}
                />
            )}
          </div>

          <div className="collection-parts">
            <h2>Movies in this collection:</h2>
            <div className="movie-grid">
              {collection.parts.map((movie) => (
                <div key={movie.id} className="movie-item">
                  <h3>
                    <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
                  </h3>
                  {movie.poster_path && (
                    <img
                      className="movie-poster"
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={`${movie.title} poster`}
                    />
                  )}
                  <p><strong>Release Date:</strong> {movie.release_date}</p>
                  <p>{movie.overview}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
    )
}

export default CollectionDetails