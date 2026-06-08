import React from 'react'
import Section1 from './components/Section1/Section1'
import Section2 from './components/Section2/Section2'

const App = () => {
  
  const users=[
    {
      image:"https://i.pinimg.com/736x/5d/4e/1e/5d4e1eb26bf36a6865cd31c3c22a2f95.jpg"
      ,content:"Driven by curiosity and determination, he inspires others while pursuing excellence in every endeavor."
      ,tag:"Satisfied"
    },
    {
      image:"https://i.pinimg.com/736x/e6/f9/9e/e6f99eb73f47222bea55b40438c158ff.jpg"
      ,content:"Quietly confident and endlessly determined, he turns aspirations into achievements through consistent effort."
      ,tag:"Satisfied"
    },
    {
      image:"https://i.pinimg.com/736x/ef/68/3e/ef683eac5d72aa0a040f8ee720925fb8.jpg"
      ,content:"A confident, ambitious, curious, determined, hardworking individual embracing challenges, learning continuously, and pursuing success fearlessly."
      ,tag:"UnSatisfied"
    },
    {
      image:"https://i.pinimg.com/736x/0c/eb/9c/0ceb9c08e9c6e3eb7bdd409e4d362d49.jpg"
      ,content:"Driven by curiosity and determination, he inspires others while pursuing excellence in every endeavor."
      ,tag:"UnSatisfied"
    },
    {
      image:"https://i.pinimg.com/1200x/98/0e/60/980e60cd4bbac48c44ad511b4e2cb452.jpg"
      ,content:"Quietly confident and endlessly determined, he turns aspirations into achievements through consistent effort."
      ,tag:"Satisfied"
    },
    {
      image:"https://i.pinimg.com/1200x/69/04/2d/69042d6771dc81f98bd7e75cd584a47f.jpg"
      ,content:"A confident, ambitious, curious, determined, hardworking individual embracing challenges, learning continuously, and pursuing success fearlessly."
      ,tag:"UnSatisfied"
    },
    {
      image:"https://i.pinimg.com/736x/a4/0e/00/a40e0000db681c8b6799ba9f93370c0a.jpg"
      ,content:"Driven by curiosity and determination, he inspires others while pursuing excellence in every endeavor."
      ,tag:"Satisfied"
    },
    {
      image:"https://i.pinimg.com/736x/68/ce/25/68ce257a6fa062110f8fc980dc11e733.jpg"
      ,content:"Quietly confident and endlessly determined, he turns aspirations into achievements through consistent effort."
      ,tag:"UnSatisfied"
    },
    {
      image:"https://i.pinimg.com/736x/2a/af/0c/2aaf0cd400e0f97313ab5591288ec95a.jpg"
      ,content:"A confident, ambitious, curious, determined, hardworking individual embracing challenges, learning continuously, and pursuing success fearlessly."
      ,tag:"Satisfied"
    }    
  ]
  return (
    <div>
        <Section1 users={users}/>
        <Section2/>
    </div>
  )
}

export default App
