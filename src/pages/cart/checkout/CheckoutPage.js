import React from 'react'
import CheckoutComponent from '../../../features/cart/checkout/CheckoutComponent'
import { Navigate } from 'react-router-dom'

function Checkout() {
  if (localStorage.getItem('token')) {
    return <CheckoutComponent />
  }
  return <Navigate to="/login" />
}

export default Checkout
