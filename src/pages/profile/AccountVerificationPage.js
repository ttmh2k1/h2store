import React from 'react'
import AccountVerificationComponent from '../../features/profile/AccountVerificationComponent'
import { Navigate } from 'react-router-dom'

function AccountVerification() {
  if (localStorage.getItem('token')) {
    return <AccountVerificationComponent />
  }
  return <Navigate to="/login" />
}

export default AccountVerification
