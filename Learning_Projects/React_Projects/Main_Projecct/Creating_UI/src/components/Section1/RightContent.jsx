import React from 'react'
import RightCards from './RightCards'

const RightContent = (props) => {
  return (
        <div id="right" className='h-full p-5 w-2/3 flex justify-around gap-5  overflow-x-auto'>
      {props.users.map(function(elem,idx){
        return <RightCards 
        key={idx}
        id={idx}
        image = {elem.image}
        content = {elem.content}
        tag = {elem.tag}
        />
      })}
        </div>
  )
}

export default RightContent
