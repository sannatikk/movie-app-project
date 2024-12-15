import axios from 'axios'

const url = process.env.REACT_APP_API_URL

const fetchFinnkinoData = async (areaId, date) => {
  try {
    const response = await fetch(`https://www.finnkino.fi/xml/Schedule/?area=${areaId}&dt=${date}`)

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.text()
    const parser = new window.DOMParser()
    const xmlDoc = parser.parseFromString(data, "text/xml")
    const showsData = xmlDoc.getElementsByTagName('Show')
    const showDetails = Array.from(showsData).map(show => {
      const dateTime = show.getElementsByTagName('dttmShowStart')[0]?.textContent
      const theatreName = show.getElementsByTagName('Theatre')[0]?.textContent
      const movieName = show.getElementsByTagName('Title')[0]?.textContent
      const theatreAuditorium = show.getElementsByTagName('TheatreAuditorium')[0]?.textContent
      const showId = show.getElementsByTagName('ID')[0]?.textContent
      let formattedDateTime = ''
      let formattedDate = ''
      if (dateTime) {
        const date = new Date(dateTime)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const month = date.getMonth().toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const year = date.getFullYear().toString()
        const monthPlusOne = (parseInt(month) + 1).toString()
        formattedDateTime = `${hours}:${minutes}`
        formattedDate = `${day}:${monthPlusOne}:${year}`
      }

      return {
        showTime: formattedDateTime,
        theatreName,
        theatreAuditorium,
        movieName,
        showId,
        areaId,
        showDate: formattedDate
      }
    })

    return showDetails

  } catch (error) {
    console.error('Failed to fetch dataa', error)
    throw new Error(`Failed to fetch data: ${error.message}`)
  }
}

// Fetch pinned showtimes for selected group
const fetchFinnkinoDataById = async (group_id, token) => {
  let date_now = new Date();
  const pinnedMovies = await axios.get(url + "/pinned/showtime/" + group_id)
  const returnArray = []

  // Check if the showtime is in the past and delete it
  for (const value of Object.values(pinnedMovies.data)) {
    let date_object = new Date(value.showdate)

    if (date_now > date_object) {
      await axios({
        method: 'delete',
        url: url + '/pinned/showtime/' + value.id,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
    }

    // Format the date to match the Finnkino API
    let formattedDate2 = value.showdate.split('T')[0].split('-').reverse().join('.')
    const areaid = value.area_id

    try {
      const response = await fetch(`https://www.finnkino.fi/xml/Schedule/?area=${value.area_id}&dt=${formattedDate2}`)
      const data = await response.text()
      const parser = new window.DOMParser()
      const xmlDoc = parser.parseFromString(data, "text/xml")
      const showsData = xmlDoc.getElementsByTagName('Show')

      Array.from(showsData).forEach(show => {
        if (show.getElementsByTagName('ID')[0]?.textContent === value.movie_id.toString()) {
          const dateTime = show.getElementsByTagName('dttmShowStart')[0]?.textContent
          const theatreName = show.getElementsByTagName('Theatre')[0]?.textContent
          const movieName = show.getElementsByTagName('Title')[0]?.textContent
          const theatreAuditorium = show.getElementsByTagName('TheatreAuditorium')[0]?.textContent
          const showId = show.getElementsByTagName('ID')[0]?.textContent

          let formattedDateTime = ''
          let formattedDate = ''

          if (dateTime) {
            const date = new Date(dateTime)
            const hours = date.getHours().toString().padStart(2, '0')
            const minutes = date.getMinutes().toString().padStart(2, '0')
            const month = date.getMonth().toString().padStart(2, '0')
            const day = date.getDate().toString().padStart(2, '0')
            const year = date.getFullYear().toString()
            const monthPlusOne = (parseInt(month) + 1).toString()

            formattedDateTime = `${hours}:${minutes}`
            formattedDate = `${day}.${monthPlusOne}.${year}`
          }

          returnArray.push({
            id: value.id,
            showTime: formattedDateTime,
            theatreName,
            theatreAuditorium,
            movieName,
            showId,
            areaid,
            showDate: formattedDate
          })
        }
      })

    } catch (error) {
      console.error('Failed to fetch data', error)
      throw new Error(`Failed to fetch data: ${error.message}`)
    }
  }
  return returnArray
}


export { fetchFinnkinoData, fetchFinnkinoDataById }