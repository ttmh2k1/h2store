import React from 'react'
import FavoriteComponent from '../features/listItem/favorite/FavoriteComponent'
import { Navigate } from 'react-router-dom'

function FavoriteProduct() {
  if (localStorage.getItem('token')) {
    return <FavoriteComponent />
  }
  return <Navigate to="/login" />
}

export default FavoriteProduct
