import React from 'react'
import { CiBookmark } from "react-icons/ci";

const Card = () => {
  return (
    <div className='card'>
        <div className='top'>
            <img src='https://m.media-amazon.com/images/I/51HCHFclmmL.jpg' alt='profile'/>
            <button>Save <CiBookmark/></button>
        </div>
        <div className="middle">
            <h3>Amazon
            <span>5 days ago</span></h3>
            <h2>Senior UI/UX Designer</h2>
            <div className='postings'>
                <h4>Part Time</h4> 
                <h4>Senior Level</h4>
            </div>
        </div>
        <div className='bottom'>
            <h3>$120/hr
            <p>Mumbai,Inida</p></h3>
            <div> 
                <button>Apply Now</button>
            </div>
        </div>
    </div>
  )
}

export default Card
