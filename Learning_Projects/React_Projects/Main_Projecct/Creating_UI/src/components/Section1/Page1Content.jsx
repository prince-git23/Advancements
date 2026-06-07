import React from 'react'
import LeftContent from './LeftContent'
import RightContent from './RightContent'

const Page1Content = () => {
  return (
    <div className='px-18 py-10 gap-10 flex items-center h-[90vh] '>
        <LeftContent/>
        <RightContent/>
    </div>
  )
}

export default Page1Content
