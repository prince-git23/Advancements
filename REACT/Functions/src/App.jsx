import React from 'react'

const App = () => {
  function btnclicked(){
    console.log("Button CLicked")
  }
  return (
    <div >
      <button onClick={btnclicked} className='m-2 p-2 border rounded-2xl bg-blue-500 hover:bg-amber-300 transition duration-1000 hover:scale-110'>
        Click Me
      </button>
    </div>
  )
}

export default App
