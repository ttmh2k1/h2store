import React from 'react'
import NotificationComponent from '../../features/notification/NotificationComponent'
import { Navigate } from 'react-router-dom'

function Notification() {
  if (localStorage.getItem('token')) {
    return <NotificationComponent />
  }
  return <Navigate to="/login" />
}

export default Notification
