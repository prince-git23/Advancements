import React from 'react'

const App = () => {
  function btnclicked(){
    console.log("Button CLicked")
  }
  function MouseEnter(){
    console.log("Mouse Entered")
  }

  return (
    <div >
      <button onClick={btnclicked} className='m-2 p-2 border rounded-2xl bg-blue-500 hover:bg-amber-300 transition duration-1000 hover:scale-110'>
        Click Me
      </button>
      <button onMouseEnter={MouseEnter} className='m-2 p-2 border rounded-2xl bg-green-500 hover:bg-amber-300 transition duration-1000 hover:scale-110'>
        Mouse Entered
      </button>
      <input onChange={()=>{
        console.log("User Is Typing")
      }} className='m-2 p-2 border rounded-2xl transition duration-1000 hover:scale-110' type='text' placeholder='Enter The Name'/>
      <input onChange={  function getElement(elem){
    console.log(elem.target.value)
  }} className='m-2 p-2 border rounded-2xl transition duration-1000 hover:scale-110' type='text' placeholder='Enter The Name'/>
    </div>
  )
}

export default App
