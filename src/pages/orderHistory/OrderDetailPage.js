import React from 'react'
import OrderDetailComponent from '../../features/orderHistory/orderDetail/OrderDetailComponent'
import { Navigate, useParams } from 'react-router-dom'

function OrderDetail() {
  const param = useParams()
  if (localStorage.getItem('token')) {
    const { orderId } = param
    return <OrderDetailComponent id={orderId} />
  }
  return <Navigate to="/login" />
}
export default OrderDetail
