import React from 'react'
import RightCards from './RightCards'

const RightContent = () => {
  return (
        <div className='h-full p-5 w-2/3 flex justify-around gap-5'>
            <RightCards image="https://i.pinimg.com/736x/5d/4e/1e/5d4e1eb26bf36a6865cd31c3c22a2f95.jpg" content="Driven by curiosity and determination, he inspires others while pursuing excellence in every endeavor." sr="1" />
            <RightCards image="https://i.pinimg.com/736x/e6/f9/9e/e6f99eb73f47222bea55b40438c158ff.jpg" content="Quietly confident and endlessly determined, he turns aspirations into achievements through consistent effort." sr="2" />
            <RightCards image="https://i.pinimg.com/736x/ef/68/3e/ef683eac5d72aa0a040f8ee720925fb8.jpg" content="A confident, ambitious, curious, determined, hardworking individual embracing challenges, learning continuously, and pursuing success fearlessly." sr="3" />
        </div>
  )
}

export default RightContent
