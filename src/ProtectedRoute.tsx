import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from './context/UserProvider'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser()

  if (!user) {
    return <Navigate to='/' />
  }

  return children
}

export default ProtectedRoute
