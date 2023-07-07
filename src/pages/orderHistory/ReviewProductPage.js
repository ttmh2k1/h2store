import React from 'react'
import ReviewProductComponent from '../../features/orderHistory/reviewProduct/ReviewProductComponent'
import { Navigate, useParams } from 'react-router-dom'

function ReviewProduct() {
  const param = useParams()
  if (localStorage.getItem('token')) {
    const { orderId } = param
    return <ReviewProductComponent id={orderId} />
  }
  return <Navigate to="/login" />
}

export default ReviewProduct
