import React, { useContext, useState } from 'react'
import { ThemeDataContext } from '../context/ThemeContext'

const Button = () => {

    const [theme, setTheme] = useContext(ThemeDataContext)
    const ChangeTheme= ()=>{
        setTheme("Dark")
    }
  return (
    <div>
      <button onClick={ChangeTheme}>Change Theme</button>
    </div>
  )
}

export default Button
