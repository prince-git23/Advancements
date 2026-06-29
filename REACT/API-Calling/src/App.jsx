import axios from 'axios'
import React from 'react'
import { useState } from 'react'

const App = () => {
  const [data, setData] = useState([])

  const getData = async() =>{
    const response = await axios.get('https://picsum.photos/v2/list')
    console.log(response)
    console.log(response.data)

    setData(response.data)
  }

  // const getData = async() =>{
  //   const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
  //   console.log(response)
  // }

  // const getData = async()=>{
  //    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  //    const data = await response.json()
  //    console.log(response)
  //    console.log(data)
  // }
   
  //Alternative
  //  async function getData(){
  //    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  //    console.log(response)
  //  }
   
  return (
    <div className='box'>
      <button onClick={getData}>Get Data</button>
      <div>
        {data.map(function(elem,idx){
          return <h3>Hello,{elem.author} {idx}</h3>
        })}
      </div>
    </div>
  )
}

export default App
