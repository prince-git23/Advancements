import React, { useState } from 'react'

const BottomButtons = ({ index, setIndex }) => {
  return (
    <div className='flex justify-center items-center gap-10'>
      <button onClick={()=>{
          if(index<1){
              setIndex(index-1)
          }
      }
      }
      className='bg-yellow-400 text-black px-5 py-2 text-sm font-semibold rounded cursor-pointer active:scale-95'>
        Prev
      </button>
      <button onClick={()=>{
          setIndex(index+1)
      }
      }
      className='bg-yellow-400 text-black px-5 py-2 text-sm font-semibold rounded cursor-pointer active:scale-95'>
        Next
      </button>
    </div>
  )
}

export default BottomButtons
