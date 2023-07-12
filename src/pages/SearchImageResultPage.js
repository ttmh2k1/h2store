import React from 'react'
import SearchImageResultComponent from '../features/listItem/searchResult/SearchImageResultComponent'
import { useParams } from 'react-router'

function SearchImageResult() {
  const param = useParams()
  const { file } = param

  return <SearchImageResultComponent file={file} />
}

export default SearchImageResult
