
import React from 'react'

const App = () => {
  async function getData(){
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    console.log(response)
  }
  return (
    <div className='box'>
      <button onClick={getData}>Get Data</button>
    </div>
  )
}

export default App
