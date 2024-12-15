// note: these are all set to be sorted by tmdb vote count (descending) bc that gives the most relevant results 
// to change sorting to tmdb popularity (don't ask me what it's based on, I have no idea bc the results are v weird), change the sort_by value to 'popularity.desc'
// to change sorting to revenue (note that this does not take inflation into account), change the sort_by value to 'revenue.desc'

const tmdb_token = process.env.REACT_APP_TMDB_TOKEN

const fetchMovieById = async (id) => {

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: tmdb_token
    }
  }

  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US', options`, options)
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }
    const data = await response.json()
    return data

  } catch (error) {
    console.error('Error fetching movies:', error)
    throw error
  }
}


const fetchMoviesByTerm = async (term) => {

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: tmdb_token
    }
  };

  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${term}&include_adult=false&language=en-US&page=1&sort_by=vote_count.desc`, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }
    const data = await response.json()
    return data;

  } catch (error) {
    console.error('Error fetching movies:', error)
    throw error
  }
}


const fetchMoviesByYear = async (year) => {

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: tmdb_token
    }
  }

  try {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_count.desc&primary_release_year=${year}`, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }
    const data = await response.json()
    return data

  } catch (error) {
    console.error('Error fetching movies:', error)
    throw error
  }
}


const fetchMoviesByLanguage = async (lang) => {

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: tmdb_token
    }
  }

  try {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_count.desc&with_original_language=${lang}`, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }
    const data = await response.json()
    return data

  } catch (error) {
    console.error('Error fetching movies:', error)
    throw error
  }
}


const fetchGenres = async () => {

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: tmdb_token
    }
  }

  try {
    const response = await fetch(`  https://api.themoviedb.org/3/genre/movie/list?language=en`, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }
    const data = await response.json();
    return data

  } catch (error) {
    console.error('Error fetching movies:', error)
    throw error
  }
}


const fetchMoviesByGenre = async (genre) => {

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: tmdb_token
    }
  }

  try {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_count.desc&with_genres=${genre}`, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }
    const data = await response.json()
    return data

  } catch (error) {
    console.error('Error fetching movies:', error)
    throw error
  }
}

const fetchCollection = async (collection) => {

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: tmdb_token
    }
  }

  try {
    const response = await fetch(`https://api.themoviedb.org/3/collection/${collection}?language=en-US`, options)
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }
    const data = await response.json()
    return data

  } catch (error) {
    console.error('Error fetching movies:', error)
    throw error
  }
}

const fetchCurrentMovies = async () => {

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: tmdb_token
    }
  }

  try {
    const response = await fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }
    const data = await response.json()
    return data

  } catch (error) {
    console.error('Error fetching movies:', error)
    throw error
  }
}


export { fetchMovieById, fetchMoviesByTerm, fetchMoviesByYear, fetchMoviesByLanguage, fetchMoviesByGenre, fetchGenres, fetchCollection, fetchCurrentMovies }