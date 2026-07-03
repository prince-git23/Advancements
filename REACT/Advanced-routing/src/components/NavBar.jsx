import React from 'react'

const NavBar = () => {
  return (
    <div className='flex py-4 px-8 justify-between bg-gray-600 text-white'>
      <h2 className='text-lg font-bold'>Prince's Workspace</h2>
      <div className='flex gap-10 text-lg font-bold'>
        <a href="/">Home</a>
        <a href="/about">About Us</a>
        <a href="/contact">Contact</a>
      </div>
    </div>
  )
}

export default NavBar
