import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const App = () => {
  const [num, setNum] = useState(0)
  const [num2, setNum2] = useState(0)
  
  //Dependency
  useEffect(function(){
    console.log("UseEffect is running...")
  },[num])

  return (
    <div className='box'>
      <h2>{num} {num2}</h2>
      <button onMouseEnter={()=>{
         setNum(num+1)
      }} onMouseLeave={()=>{
        setNum2(num2+100)
      }}>Hover Me</button>
      {/* ALternative Thing */}
      {/* <button onClick={()=>{
        setNum(num+1)
        setNum2(num2+100)
      }}>Click me</button> */}

    </div>
  )
}

export default App
