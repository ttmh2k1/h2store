import React from 'react'
import OrderHistoryComponent from '../../features/orderHistory/OrderHistoryComponent'
import { Navigate } from 'react-router-dom'

function OrderHistory() {
  if (localStorage.getItem('token')) {
    return <OrderHistoryComponent />
  }
  return <Navigate to="/login" />
}

export default OrderHistory
