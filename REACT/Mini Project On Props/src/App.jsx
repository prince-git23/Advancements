import React from 'react'
import Card from './components/Card'

const App = () => {
  const jobOpenings = [
  {
    brandLogo: "https://media.wired.com/photos/5926ffe47034dc5f91bed4e8/3:2/w_2560%2Cc_limit/google-logo.jpg",
    name: "Google",
    datePosted: "3 days ago",
    post: "Frontend Developer",
    tag1: "Full Time",
    tag2: "Junior Level",
    pay: "$45/hr",
    location: "Bangalore, India"
  },
  {
    brandLogo: "https://cdn.dribbble.com/userupload/29828185/file/original-5bcab5b55efba8f8486479f1d72a3106.png",
    name: "Microsoft",
    datePosted: "1 week ago",
    post: "Software Engineer",
    tag1: "Full Time",
    tag2: "Mid Level",
    pay: "$52/hr",
    location: "Hyderabad, India"
  },
  {
    brandLogo: "https://1000logos.net/wp-content/uploads/2016/10/Amazon-logo-meaning.jpg",
    name: "Amazon",
    datePosted: "5 days ago",
    post: "Backend Developer",
    tag1: "Full Time",
    tag2: "Junior Level",
    pay: "$48/hr",
    location: "Mumbai, India"
  },
  {
    brandLogo: "https://cdn.pixabay.com/photo/2021/12/14/22/29/meta-6871457_960_720.png",
    name: "Meta",
    datePosted: "2 weeks ago",
    post: "React Developer",
    tag1: "Full Time",
    tag2: "Senior Level",
    pay: "$75/hr",
    location: "London, UK"
  },
  {
    brandLogo: "https://i.pinimg.com/736x/60/6b/c0/606bc0717982547e555a514b479365a0.jpg",
    name: "Apple",
    datePosted: "4 days ago",
    post: "iOS Developer",
    tag1: "Full Time",
    tag2: "Mid Level",
    pay: "$68/hr",
    location: "Cupertino, USA"
  },
  {
    brandLogo: "https://images.ctfassets.net/4cd45et68cgf/Rx83JoRDMkYNlMC9MKzcB/2b14d5a59fc3937afd3f03191e19502d/Netflix-Symbol.png?w=700&h=456",
    name: "Netflix",
    datePosted: "10 days ago",
    post: "UI/UX Engineer",
    tag1: "Contract",
    tag2: "Senior Level",
    pay: "$82/hr",
    location: "Los Angeles, USA"
  },
  {
    brandLogo: "https://www.nvidia.com/content/dam/en-zz/Solutions/about-nvidia/logo-and-brand/nvidia-og-image-white-bg-1200x630.jpg",
    name: "NVIDIA",
    datePosted: "6 days ago",
    post: "AI Engineer",
    tag1: "Full Time",
    tag2: "Senior Level",
    pay: "$90/hr",
    location: "Pune, India"
  },
  {
    brandLogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzTmVc7unwsynm3Ofz31vehWOoGK4FMpkPtw&sm",
    name: "Adobe",
    datePosted: "3 weeks ago",
    post: "Full Stack Developer",
    tag1: "Full Time",
    tag2: "Mid Level",
    pay: "$58/hr",
    location: "Noida, India"
  },
  {
    brandLogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlJIOGtHi6yLhWs9gI0Bz1T83KoUzuqCQ7IQ&s",
    name: "Uber",
    datePosted: "8 days ago",
    post: "Data Engineer",
    tag1: "Part Time",
    tag2: "Junior Level",
    pay: "$50/hr",
    location: "Delhi, India"
  },
  {
    brandLogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI3iOOaOXJxw6zFE8PjrJ0hE21bXxIYGtg9Q&s",
    name: "OpenAI",
    datePosted: "2 days ago",
    post: "Machine Learning Engineer",
    tag1: "Full Time",
    tag2: "Senior Level",
    pay: "$110/hr",
    location: "San Francisco, USA"
  }
];
  return (
    <div className='parent'>
      {jobOpenings.map(function(elem){
        return <Card 
        image = {elem.brandLogo}
        name = {elem.name}
        datePosted = {elem.datePosted}
        post = {elem.post}
        tag1 = {elem.tag1}
        tag2 = {elem.tag2}
        pay = {elem.pay}
        location = {elem.location}
        />
      })}
    </div>
  )
}

export default App
