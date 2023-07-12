import React from 'react'
import SearchResultComponent from '../features/listItem/searchResult/SearchResultComponent'
import { useParams } from 'react-router'

function SearchResult() {
  const param = useParams()
  const { text } = param
  return <SearchResultComponent text={text} />
}

export default SearchResult
