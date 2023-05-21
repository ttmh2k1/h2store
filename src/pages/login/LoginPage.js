import React from 'react'
import { Navigate } from 'react-router-dom'
import LoginComponent from '../../features/login/LoginComponent'

function Login() {
  if (localStorage.getItem('token')) {
    return <Navigate to="/" />
  }
  return <LoginComponent />
}

export default Login
