import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <div className='flex py-4 px-8 justify-between bg-gray-600 text-white'>
      <h2 className='text-lg font-bold'>Prince's Workspace</h2>
      <div className='flex gap-10 text-lg font-medium'>
        <Link to='/'>Home</Link>
        <Link to='/about'>About Us</Link>
        <Link to='/contact'>Contact</Link>
        <Link to='/product'>Product</Link>
      </div>
    </div>
  )
}

export default NavBar
