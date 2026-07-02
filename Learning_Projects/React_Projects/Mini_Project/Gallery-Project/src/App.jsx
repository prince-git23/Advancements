
import React from 'react'

const App = () => {
  function getdata(){

  }
  return (
    <div className='bg-black h-screen p-4 text-white'>
      <button onClick={getdata} className='bg-green-600 active:scale-95 mb-3 px-5 py-2 rounded text-white'>Get data</button>
    </div>
  )
}

export default App
