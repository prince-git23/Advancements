import React, { useContext } from 'react'
import Nav2 from './Nav2'
import { ThemeDataContext } from '../context/ThemeContext'

const Navbar = () => {
    const [light] = useContext(ThemeDataContext)


  return (
    <div className={`${light} nav`}>
      <h2>Prince's Workspace</h2>
      <Nav2 />
    </div>
  )
}

export default Navbar
