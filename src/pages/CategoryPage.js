import React from 'react'
import CategoryComponent from '../features/listItem/category/CategoryComponent'
import { useParams } from 'react-router-dom'

function Category() {
  const param = useParams()
  const { categoryId } = param
  return <CategoryComponent id={categoryId} />
}

export default Category
