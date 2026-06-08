import React from 'react'
import 'remixicon/fonts/remixicon.css'

const RightCard = () => {
  return (
    <div className='w-1/3 h-full overflow-hidden relative bg-red-500 rounded-4xl'>
      <img className="object-cover h-full w-full" src="https://i.pinimg.com/736x/ef/68/3e/ef683eac5d72aa0a040f8ee720925fb8.jpg" alt="" />
      <div className='w-full h-full absolute top-0 left-0  p-6 flex flex-col justify-between'>
        <h2 className='rounded-full bg-white size-10 flex justify-center items-center'>1</h2>
        <div className=''>
          <p className='text-lg leading-normal text-white mb-10'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias dolore incidunt, ratione assumenda nemo in?</p>
          <div className='flex justify-between'>
            <button className='bg-blue-500 px-8 py-2 rounded-full text-white'>Satisfied</button>
            <button className='bg-blue-500 px-4 py-2 rounded-full text-white'><i class="ri-arrow-right-line"></i></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightCard
