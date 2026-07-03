import React from 'react'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import { Route , Routes } from 'react-router-dom'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import NotFound from './pages/NotFound'
import Men from './pages/Men'
import Women from './pages/Women'
import Kids from './pages/Kids'

const App = () => {
  return (
    <div className='h-screen bg-black text-white'>
      <NavBar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/product' element={<Product/>}>
            <Route path='men' element={<Men/>}/>
            <Route path='women' element={<Women/>}/> 
            <Route path='kids' element={<Kids/>}/> 
          </Route>

          {/* Alternative incorrect nested routes
          <Route path='/product/men' element={<Men/>}/>
          <Route path='/product/women' element={<Women/>}/> */}
          <Route path='*' element={<NotFound/>}/>
        </Routes>
      <Footer/>
    </div>
  )
}

export default App
