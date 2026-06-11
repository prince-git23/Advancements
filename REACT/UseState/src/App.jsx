import React, { useState } from 'react'

const App = () => {
  const [num, setnum] = useState(10)
  function ChangeNum(){
    setnum(20)
  }
  return (
    <div>
      <h1>Hello I had a {num}</h1>
      <button onClick={ChangeNum}>CLick Me</button>
    </div>
  )
}

export default App
