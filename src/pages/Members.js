import React, { useState, useEffect } from "react"
import { MainHeader } from "../components/header/Header"
import { Link, useNavigate } from "react-router-dom"
import { UseUser } from "../context/UseUser.js"
import './Members.css'

const url = process.env.REACT_APP_API_URL

function Members() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  const { token } = UseUser()
  const navigate = useNavigate()

  useEffect(() => {

    if (!token) {
      navigate('/error')
    }
  
    const fetchUsers = async () => {
      try {
        const response = await fetch(url + `/user/members`)
        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }
        const data = await response.json();
  
        // sort users alphabetically
        const sortedUsers = data.sort((a, b) => 
          a.uname.toLowerCase().localeCompare(b.uname.toLowerCase())
        )
  
        setUsers(sortedUsers)
      } catch (error) {
        setError("Error fetching users")
        console.error(error)
      }
    }
  
    fetchUsers();
  }, [navigate, token])

  return (
    <div>
      <MainHeader text="All Our Members:" />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul className="member-list">
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          users.map((user) => (
            <li key={user.id} className="highlight-box member-box">
              <Link to={`/account/${user.id}`}>
                {user.uname}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default Members;
