import React from 'react'
import { useNavigate } from 'react-router-dom'

const NavBar2 = () => {
    // Use Navigate Basics
    const navigate = useNavigate()
  
    // const btnClicked = ()=>{
    //   navigate('/')
    // }
  return (
    <div className='py-3 px-5'>
      <button onClick={()=>{
        navigate('/')
      }}className='px-5 py-2 bg-blue-500 rounded m-2 cursor-pointer active:scale-95 hover:bg-blue-600 font-medium'>Return to Home Page</button>
      <button onClick={()=>{
        navigate(-1)
      }}className='px-5 py-2 bg-blue-500 rounded m-2 cursor-pointer active:scale-95 hover:bg-blue-600 font-medium'>Back</button>
      <button onClick={()=>{
        navigate(1)
      }}className='px-5 py-2 bg-blue-500 rounded m-2 cursor-pointer active:scale-95 hover:bg-blue-600 font-medium'>Next</button>
    </div>
  )
}

export default NavBar2
