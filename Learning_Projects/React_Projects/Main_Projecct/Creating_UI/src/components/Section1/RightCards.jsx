import React from 'react'
import 'remixicon/fonts/remixicon.css'

const RightCards = (props) => {
  return (
    <div className='w-1/3 h-full overflow-hidden relative  rounded-4xl hover:scale-105 hover:brightness-115 transition duration-500 shrink-0'>
      <img className="object-cover h-full w-full" src={props.image} alt="" />
      <div className='w-full h-full absolute top-0 left-0  p-6 flex flex-col justify-between'>
        <h2 className='rounded-full bg-white size-10 flex justify-center items-center'>{props.id+1}</h2>
        <div className=''>
          <p className='text-lg leading-normal text-white mb-10'>{props.content}</p>
          <div className='flex justify-between'>
            <button className='bg-blue-500 px-8 py-2 rounded-full text-white hover:scale-105 hover:bg-blue-700' id="btn">
              {props.tag === "UnSatisfied" ? "UnSatisfied" : "Satisfied"}
            </button>
            <button className='bg-blue-500 px-4 py-2 rounded-full text-white hover:scale-105 hover:bg-blue-700'><i class="ri-arrow-right-line"></i></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightCards
