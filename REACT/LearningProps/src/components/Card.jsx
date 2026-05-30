import React from 'react'

const Card = (props) => {
  return (
    <div className='card'>
        <img src = {props.image} alt = "img" />
        <h1>{props.user}</h1>
        <p>{props.description}</p>
    </div>
  )
}

export default Card
