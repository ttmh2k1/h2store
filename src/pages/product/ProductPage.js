import React from 'react'
import ProductComponent from '../../features/product/ProductComponent'
import { useParams } from 'react-router-dom'

function Product() {
  const param = useParams()
  const { productId } = param
  return <ProductComponent id={productId} />
}

export default Product
