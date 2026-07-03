import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'

const App = () => {
  return (
    <div>
      <div className='nav'>
        <h2>Prince WorkSpace</h2>
        <div>
          <a href="/">Home</a>
          <a href="/contacts">Contact</a>
          <a href="/about">About us</a>
        </div>
      </div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contacts' element={<Contact />} />
      </Routes>
    </div>
  )
}

export default App
