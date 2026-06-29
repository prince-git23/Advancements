import React from 'react'

const App = () => {
  // To clear From local Stoage and Session Storage
  localStorage.clear()
  sessionStorage.clear()

  // To Set iem into the Local Stoage
  localStorage.setItem("user","sarthak")
  localStorage.setItem("age","18")
  
  //To get item from the local storage
  const user = localStorage.getItem("user")
  console.log(user)
  const age = localStorage.getItem("age")
  console.log(age)

  //To store array of objects
  const user2 = {
    user : 'Prince',
    age : 20,
    role : 'Software Developer'
  }
  localStorage.setItem("user",JSON.stringify(user2))

  const userdetails = JSON.parse(localStorage.getItem('user'))
  console.log(userdetails)



  return (
    <div>
      App
    </div>
  )
}

export default App
