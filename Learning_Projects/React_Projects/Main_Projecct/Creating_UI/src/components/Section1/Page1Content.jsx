import React from 'react'
import LeftContent from './LeftContent'
import RightContent from './RightContent'

const Page1Content = (props) => {
  return (
    <div className='px-18 py-10 gap-10 flex items-center h-[90vh] '>
        <LeftContent/>
        <RightContent users={props.users}/>
    </div>
  )
}

export default Page1Content
