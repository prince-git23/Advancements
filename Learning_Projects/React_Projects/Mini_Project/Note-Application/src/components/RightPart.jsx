import React from 'react'
import { X } from 'lucide-react';

const RightPart = (props) => {

    const deleteNote = (idx)=>{
        console.log("Note Has been Deleted")
        const copyTask = [...props.task]
        copyTask.splice(idx,1)
        props.setTask(copyTask)
    }

    return (
        <div className=' p-10 lg:w-1/2 '>
            <h1 className='text-3xl text-white font-bold py-2'>Your Notes</h1>
            {/* fokkat ki gap hatamne k liye use item-start justify-start */}
            <div className='flex flex-wrap gap-5  overflow-auto item-start'>
                {props.task.map(function(elem,idx){
                    return <div key={idx} className='relative flex flex-col item-start h-55 w-40 bg-cover bg-position-[70%_center] bg-[url("https://static.vecteezy.com/system/resources/thumbnails/037/152/688/small_2x/sticky-note-paper-background-free-png.png")] rounded-3xl px-5 pt-5'>
                        <h3 className='text-black text-2xl leading-tight font-bold'>{elem.note}</h3>
                        <p className='text-gray-600 leading-tight font-medium mt-2'>{elem.details}</p>
                        <h2 className='absolute bottom-3 right-3 hover:scale-125 '><X color="#000000" onClick={()=>{
                            deleteNote(idx)
                        }}/></h2>
                    </div>
                })}
            </div>
        </div> 
    )
}

export default RightPart
