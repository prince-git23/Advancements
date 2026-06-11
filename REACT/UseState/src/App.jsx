import React, { useState } from 'react'

const App = () => {
  const [num, setnum] = useState(10)
  const [user, setuser] = useState("Vidhi")
  function ChangeNum(){
    setnum(20)
    setuser("prince")
  }
  return (
    <div>
      <h1>Hello I had a {num}</h1>
      <h2>USername is {user}</h2>
      <button onClick={ChangeNum}>CLick Me</button>
    </div>
  )
}

export default App
