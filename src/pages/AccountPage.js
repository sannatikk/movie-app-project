import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import { UseUser } from '../context/UseUser.js'
import ReviewsByUser from '../components/reviews/ReviewsByUser.js'
import { MainHeader, SectionHeader } from "../components/header/Header.js"
import ProfileFavoriteList from "../components/account/AccountFavorites.js"
import ProfileGroupList from "../components/account/AccountGroups.js"
import './AccountPage.css'

function ProfilePage() {
    const { user, token } = UseUser()
    const { id } = useParams()
    const [profileName, setProfileName] = useState('Profile')
    const navigate = useNavigate()

    const url = process.env.REACT_APP_API_URL

    useEffect(() => {
        if (!token) {
            navigate('/error')
        }
    }, [token, navigate])

    useEffect(() => {
        if (id) {
            const getUsername = async () => {
                try {
                    const response = await fetch(url + '/user/username/' + id)
                    const data = await response.json()
                    const username = data[0].uname
                    setProfileName(username)
                } catch (error) {
                    console.log(error)
                }
            }
            getUsername()
        }
    }, [id, url])

    const handleDeleteProfile = () => {
        navigate('/delete')
    }

    const handleFavoritesLink = () => {
        navigate('/favorites/' + id)
    }

    return (
        <div>
            <MainHeader text={profileName} />
            <SectionHeader text='Favorites' />
            <ProfileFavoriteList id={id} />
            <button className="permalink-button" onClick={handleFavoritesLink}>Permalink to My Favorites Page</button>

            <SectionHeader text='Reviews' />
            <ReviewsByUser id={id} />

            <SectionHeader text='Groups' />
            <ProfileGroupList id={id} />

            {parseInt(user.id) === parseInt(id) && (
                <button className="major-delete-button" onClick={handleDeleteProfile}>Delete Account</button>
            )}
        </div>
    )
}

export default ProfilePage