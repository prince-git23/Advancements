import React, { useState } from 'react';

const App = () => {

  const [title, setTitle] = useState('aman')

  const submitHandler = (e) => {
    e.preventDefault()
    console.log("Your Form has been submitted by",title)

    setTitle(' ') //to make that refresh
  }

  return (
    <div>
      <form onSubmit={(e) => {
        submitHandler(e);
      }}>
        <input type="text" placeholder='Enter Your Name' value={title} onChange={(e) => {
          setTitle(e.target.value)
        }} />
        <button>Submit</button>
      </form>
    </div>
  )
}

export default App
