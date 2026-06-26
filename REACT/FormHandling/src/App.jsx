
import React from 'react'

const App = () => {

  const submitHandler = (e) => {
    e.preventDefault()
    console.log("Your Form has been submitted")
  }

  return (
    <div>
      <form onSubmit={(e)=> {
        submitHandler(e);
      }}>
        <input type="text" placeholder='Input Here' />
        <button>Submit</button>
      </form>
    </div>
  )
}

export default App
