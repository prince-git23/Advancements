import axios from 'axios'
import React, { useEffect, useState } from 'react'
import BottomButtons from './components/BottomButtons'

const App = () => {
  const [userData, setUserData] = useState([])
  const getdata = async () => {
    const response = await axios.get('https://picsum.photos/v2/list?page=2&limit=30')
    setUserData(response.data)
    console.log(response.data)
  }

  useEffect(function(){
    getdata()
  },[])

  let printUserData = <h3 className='text-gray-400'>No User Available</h3>
  if (userData.length > 0) {
    printUserData = userData.map(function (elem, idx) {
      return <div className='group' key={idx}>
        <a href={elem.url}>
          <div className='h-40 w-44  transition duration-1000 group-hover:scale-120 brightness-110'>
            <img className='h-full w-full object-cover rounded-2xl overflow-hidden' src={elem.download_url} alt="Image" />
          </div>
          <h2 className='transition duration-1000 group-hover:opacity-0'>{elem.author}</h2>
        </a>
      </div>
    })
  }
  return (
    <div className='bg-black h-screen p-4 text-white overflow-auto'>
      <div className='flex flex-wrap gap-10 '>
        {printUserData}
      </div>
      <BottomButtons/>
    </div>
  )
}

export default App
