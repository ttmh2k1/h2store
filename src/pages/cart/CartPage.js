import React from 'react'
import CartComponent from '../../features/cart/CartComponent'
import { Navigate } from 'react-router-dom'

function Cart() {
  if (localStorage.getItem('token')) {
    return <CartComponent />
  }
  return <Navigate to="/login" />
}

export default Cart
