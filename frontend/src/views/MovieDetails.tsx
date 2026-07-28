import React from 'react'
import { useParams } from 'react-router'

type Props = {}

const MovieDetails = (props: Props) => {
    const {id} = useParams()
  return (
    <div>MovieDetails: {id}</div>
  )
}

export default MovieDetails