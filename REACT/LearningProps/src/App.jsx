import React from 'react'
import Card from './components/Card'

const App = () => {
  return (
    <div className='parent'>
      <Card user="Abhishek Rahangdale" description="Abhishek carries a quiet confidence, kind heart, and humble nature. Like Tobey Maguire's Spider-Man, he stays responsible, resilient, thoughtful, and always ready to help others." image="https://i.pinimg.com/1200x/51/47/2c/51472c8178a0d4f17aecd69ab5a8420e.jpg"/>
      <Card user= "Prince Yadav" description = "Prince is witty, energetic, and emotionally strong. Like Andrew Garfield's Spider-Man, he combines intelligence with charm, faces challenges bravely, values relationships deeply, and inspires others through resilience." image ="https://i.pinimg.com/736x/f2/6f/71/f26f7163141776f54c0e5a371c340a5f.jpg"/>
      <Card user="Paritosh Upadhyay" description="Paritosh is cheerful, quick-witted, and determined. Like Tom Holland's Spider-Man, he balances ambition with humility, learns from challenges, stays optimistic, and brings positive energy everywhere." image="https://i.pinimg.com/736x/61/19/73/61197340850e933fedf1ae5c7ba3cbdd.jpg"/>
    </div>
  )
}

export default App
