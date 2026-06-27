import React from 'react'

const RightPart = () => {
    return (
        <div className=' p-10 lg:w-1/2 '>
            <h1 className='text-3xl text-white font-bold py-2'>Your Notes</h1>
            <div className='flex flex-wrap gap-5 h-full overflow-auto'>
                <div className='h-50 w-40 bg-white rounded-2xl '></div>
                <div className='h-50 w-40 bg-white rounded-2xl '></div>
                <div className='h-50 w-40 bg-white rounded-2xl '></div>
                <div className='h-50 w-40 bg-white rounded-2xl '></div>
                <div className='h-50 w-40 bg-white rounded-2xl '></div>
                <div className='h-50 w-40 bg-white rounded-2xl '></div>
                <div className='h-50 w-40 bg-white rounded-2xl '></div>
                <div className='h-50 w-40 bg-white rounded-2xl '></div>
                <div className='h-50 w-40 bg-white rounded-2xl '></div>
            </div>
        </div>
    )
}

export default RightPart
