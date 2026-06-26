import React, { useState } from 'react'

const Counter = () => {

    const [num, setNum] = useState(0)


    const ChangeDetails = ()=>{
        setNum(num+1)
    }

    const ChangeCount3 = () =>{
        //Batch Update
        setNum(prev=>(prev+1))
        setNum(prev=>(prev+1))
        setNum(prev=>(prev+1))
    }

  return (
    <div>
      <h1 className='text-4xl m-5 text-black'> {num} </h1>
      <button onClick={ChangeDetails} className='m-5 p-5 bg-black text-white rounded-xl text-4xl  hover:bg-gray-500 transition duration-500'>Count 1</button>
      <button onClick={ChangeCount3} className='m-5 p-5 bg-black text-white rounded-xl text-4xl  hover:bg-gray-500 transition duration-500'>Count 3</button>
      
    </div>
  )
}

export default Counter
