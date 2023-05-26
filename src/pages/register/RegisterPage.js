import React from 'react'
import { Navigate } from 'react-router-dom'
import RegisterComponent from '../../features/register/RegisterComponent'

function Register() {
  if (localStorage.getItem('token')) {
    return <Navigate to="/" />
  }
  return <RegisterComponent />
}

export default Register
