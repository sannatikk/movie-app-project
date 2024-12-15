import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { UseUser } from "../../context/UseUser.js"

export default function ProtectedRoute() {
    const { user, token } = UseUser()
    if (!user || token) return <Navigate to='/signin' />
    return <Outlet /> 
}