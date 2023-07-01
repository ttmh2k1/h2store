import React from 'react'
import AddressComponent from '../../features/profile/address/AddressComponent'
import { Navigate } from 'react-router-dom'

function Address() {
  if (localStorage.getItem('token')) {
    return <AddressComponent />
  }
  return <Navigate to="/login" />
}

export default Address
