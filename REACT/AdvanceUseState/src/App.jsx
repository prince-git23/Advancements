import React, { useState } from 'react';
import Counter from './components/Counter';

const App = () => {
  const [user, setuser] = useState({username:"Prince",age:19})
  function ChangeDetails(){
    const newNum = {...user}; //Copying earliear username with destructing 
    newNum.username = "Vidhi"
    newNum.age = 20
    setuser(newNum)
  }
  const[num,setNum] = useState([10,20,30])
  const push = () =>{
    const newNum = [...num]
    newNum.push(99)
    setNum(newNum)
  }

  const [age, setAge] = useState({user : "Prince",age:17})
    const ChangeAge = () =>{
        setAge(prev=>({...prev,age:50}))
    }
 
  return (
    <div > 
      <h1 className='text-4xl m-5 text-black'> Hello I am {user.username}. <br /> I am at the age of {user.age}.</h1>
      <button onClick={ChangeDetails} className='m-5 p-5 bg-black text-white rounded-xl text-4xl  hover:bg-gray-500 transition duration-500'>Click Me</button>
      <h1 className='text-4xl m-5 text-black'> Hello This is an array {num}</h1>
      <button onClick={push} className='m-5 p-5 bg-black text-white rounded-xl text-4xl  hover:bg-gray-500 transition duration-500'>Click Me</button>
       <h1 className='text-4xl m-5 text-black'> {age.user} , {age.age} </h1>
      <button onClick={ChangeAge} className='m-5 p-5 bg-black text-white rounded-xl text-4xl  hover:bg-gray-500 transition duration-500'>Click Me</button>
      <Counter/>
    </div>
  )
}

export default App
