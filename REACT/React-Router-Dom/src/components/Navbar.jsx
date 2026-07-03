import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className='nav'>
            <h2>Prince WorkSpace</h2>
            <div>
                <Link to='/'>Home</Link>
                <Link to='/about'>About Us</Link>
                <Link to='/contacts'>Contact</Link>             
            </div>
        </div>
    )
}

export default Navbar
