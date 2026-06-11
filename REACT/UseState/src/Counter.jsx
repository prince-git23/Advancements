import React, { useState } from 'react'

const Counter = () => {
    const [num, setnum] = useState(0)
    function increase(){
        setnum(num+1)
    }
    function decrease(){
        setnum(num-1)
    }
  return (
    <div>
        <h1 class="h1-counter">{num}</h1>
      <button onClick={increase}>Increase</button>
      <button onClick={decrease}>Decrease</button>
    </div>
  )
}

export default Counter
