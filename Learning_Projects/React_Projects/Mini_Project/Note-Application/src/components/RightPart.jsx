import React from 'react'

const RightPart = (props) => {
    return (
        <div className=' p-10 lg:w-1/2 '>
            <h1 className='text-3xl text-white font-bold py-2'>Your Notes</h1>
            {/* fokkat ki gap hatamne k liye use item-start justify-start */}
            <div className='flex flex-wrap gap-5 h-full overflow-auto item-start'>
                {props.task.map(function(elem,idx){
                    return <div key={idx} className='h-50 w-40 bg-cover bg-[url("https://static.vecteezy.com/system/resources/thumbnails/037/152/688/small_2x/sticky-note-paper-background-free-png.png")] rounded-2xl px-5 py-4'>
                        <h3 className='text-black text-2xl leading-tight font-bold'>{elem.note}</h3>
                        <p className='text-gray-600 leading-tight font-medium mt-2'>{elem.details}</p>
                    </div>
                })}
            </div>
        </div>
    )
}

export default RightPart
