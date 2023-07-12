import React from 'react'
import RankingComponent from '../../features/profile/RankingComponent'
import { Navigate } from 'react-router-dom'

function Ranking() {
  if (localStorage.getItem('token')) {
    return <RankingComponent />
  }
  return <Navigate to="/login" />
}

export default Ranking
