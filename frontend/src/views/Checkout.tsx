import React from 'react'
import { useParams } from 'react-router'


const Checkout = () => {
    const {bookingId} = useParams()
  return (
    <div>Checkout:{bookingId}</div>
  )
}

export default Checkout