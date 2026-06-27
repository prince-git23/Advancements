import React from 'react'

const App = () => {
  return (
    <div className='h-screen bg-black text-white ' >
      <form className='flex p-10 flex-col items-start gap-5'>
        <input type="text" placeholder='Enter Notes Heading' className='px-5 py-2 w-1/2 border-2 rounded'/>
        <textarea type="text" placeholder='Write Details'className='px-5 py-2 h-32 w-1/2 border-2 rounded' />
        <button className='bg-white text-black px-5 py-2 w-1/2 border-2 rounded'>Submit</button>
      </form>
    </div>
  )
}

export default App
