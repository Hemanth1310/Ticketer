import React from 'react'
import { useParams } from 'react-router'


const BookingDetails = () => {
    const {bookingId} = useParams()
  return (
    <div>BookingDetails:{bookingId}</div>
  )
}

export default BookingDetails