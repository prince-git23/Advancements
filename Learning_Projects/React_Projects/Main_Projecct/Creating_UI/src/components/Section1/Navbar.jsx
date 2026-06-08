import React from 'react'

const Navbar = () => {
  return (
    <div className='flex items-center  justify-between py-6 px-16'>
      <h4 className='bg-black text-white rounded-full px-6 py-2 uppercase hover:scale-105 hover:bg-gray-600 transition duration-500'>Target Audience</h4>
      <button className='bg-gray-100 px-6 py-2 uppercase rounded-full hover:scale-105 hover:bg-gray-400 transition duration-500'>Digital Banking Platform</button>
    </div>
  )
}

export default Navbar
