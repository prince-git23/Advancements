import React from 'react'
import { CiBookmark } from "react-icons/ci";

const Card = (props) => {
  return (
    <div className='card'>
        <div className='top'>
            <img src={props.image} alt='profile'/>
            <button>Save <CiBookmark/></button>
        </div>
        <div className="middle">
            <h3>{props.name}
            <span>{props.datePosted}</span></h3>
            <h2>{props.post}r</h2>
            <div className='postings'>
                <h4>{props.tag1}</h4> 
                <h4>{props.tag2}</h4>
            </div>
        </div>
        <div className='bottom'>
            <h3>{props.pay}
            <p>{props.location}</p></h3>
            <div> 
                <button>Apply Now</button>
            </div>
        </div>
    </div>
  )
}

export default Card
