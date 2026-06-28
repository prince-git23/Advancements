import React, { useState } from 'react'
import RightPart from './components/RightPart'

const App = () => {
  const [note, setNote] = useState("")
  const [details, setDetails] = useState("")
  const [task, setTask] = useState([])
  
  const submitHandler = (e) => {
    console.log("Note Heading is:",note)
    console.log("Details are:",details)
    e.preventDefault()

    const copyTask = [...task]
    copyTask.push({note,details})

    setTask(copyTask)
    setNote("")
    setDetails("")
  }

  return (
    <div className='h-screen bg-black text-white lg:flex' >
      <form onSubmit={(e) => {
        submitHandler(e)
      }} className='flex p-10 flex-col items-start gap-5 lg:w-1/2 lg:border-r-2'>
        <h1 className='text-3xl text-white font-bold py-2'>Add Notes</h1>

        {/* For FIrst Input For heading */}
        <input type="text" 
        placeholder='Enter Notes Heading' 
        className='px-5 py-2  w-full border-2 rounded' 
        value={note}
        onChange={(e)=>{
          setNote(e.target.value)
        }}/>

        <textarea type="text" 
        placeholder='Write Details' 
        className='px-5 py-2 h-32  w-full border-2 rounded' 
        value={details}
        onChange={(e)=>{
          setDetails(e.target.value)
        }}/>

        <button className='bg-white active:bg-gray-500 text-black px-5 py-2 border-2 rounded w-full'>Submit</button>
      </form>
      <RightPart task={task} setTask={setTask}/>
    </div>
  )
}

export default App
