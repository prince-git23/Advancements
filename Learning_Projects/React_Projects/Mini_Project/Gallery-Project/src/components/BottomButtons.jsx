import React, { useState } from 'react'

const BottomButtons = ({ index, setIndex , userData , setUserData}) => {
    const [pressed, setPressed] = useState(false)
  return (
    <div className='fixed bottom-5 left-1/2 -translate-x-1/2 flex gap-10 p-4'>
      <button onMouseDown={()=>{
        setPressed(false)
      }} 
      onMouseUp={()=>{
        setPressed(true)
      }} 
      style={{opacity: index==1 ?0.5 : 1 ,transform: pressed ? "scale(0.95)" : "scale(1)"}} 
      onClick={()=>{
          if(index>1){
              setIndex(index-1)
              setUserData([])
          }
      }
      }
      className='bg-yellow-400 text-black px-5 py-2 text-sm font-semibold rounded cursor-pointer active:scale-95'>
        Prev
      </button>
      <h4>Page {index}</h4>
      <button onClick={()=>{
          setIndex(index+1)
          setUserData([])
      }
      }
      className='bg-yellow-400 text-black px-5 py-2 text-sm font-semibold rounded cursor-pointer active:scale-95'>
        Next
      </button>
    </div>
  )
}

export default BottomButtons
