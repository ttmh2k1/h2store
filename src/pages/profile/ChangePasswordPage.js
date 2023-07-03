import React from 'react'
import ChangePasswordComponent from '../../features/profile/ChangePasswordComponent'
import { Navigate } from 'react-router-dom'

function ChangePassword() {
  if (localStorage.getItem('token')) {
    return <ChangePasswordComponent />
  }
  return <Navigate to="/login" />
}

export default ChangePassword
