import React from 'react'
import { useParams } from 'react-router'

const ShowtimeBooking = () => {
    const {id} = useParams()
  return (
    <div>ShowtimeBooking:{id}</div>
  )
}

export default ShowtimeBooking