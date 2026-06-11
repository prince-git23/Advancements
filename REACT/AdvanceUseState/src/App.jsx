import React, { useState } from 'react';

const App = () => {
  const [user, setuser] = useState({username:"Prince",age:19})
  function ChangeDetails(){
    setuser({
      username:"Vidhi",
      age:20
    })
  }
 
  return (
    <div > 
      <h1 className='text-4xl m-5 text-black'> Hello I am {user.username}. <br /> I am at the age of {user.age}.</h1>
      <button onClick={ChangeDetails} className='m-5 p-5 bg-black text-white rounded-xl text-4xl  hover:bg-gray-500 transition duration-500'>Click Me</button>
    </div>
  )
}

export default App
