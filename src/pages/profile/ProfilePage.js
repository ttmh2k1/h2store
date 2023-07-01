import React from 'react'
import ProfileComponent from '../../features/profile/ProfileComponent'
import { Navigate } from 'react-router-dom'

function Profile() {
  if (localStorage.getItem('token')) {
    return <ProfileComponent />
  }
  return <Navigate to="/login" />
}

export default Profile
