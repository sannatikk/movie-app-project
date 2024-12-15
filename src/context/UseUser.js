import { useContext } from 'react'
import { UserContext } from './UserContext.js'

export const UseUser = () => {
    return useContext(UserContext)
}