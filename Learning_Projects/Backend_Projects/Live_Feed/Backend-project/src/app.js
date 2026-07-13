const express = require('express')
const postModel = require("./models/post.model")
const multer = require('multer')
const uploadFile = require("./services/storage.service")
const cors = require('cors')
const app = express()
app.use(cors())
const upload = multer({
     storage :  multer.memoryStorage()
})
app.use(express.json())

app.post('/create-post', upload.single('image'), async (req, res) => {
     console.log(req.body)
     console.log(req.file)
     const result = await uploadFile(req.file.buffer)
     
     const post = await postModel.create({
          image : result.url,
          caption : req.body.caption
     })
     res.status(200).json({
           message: 'Post Created Successfully', post
     });
          
})

app.get('posts',async(req,res)=>{
     const posts = postModel.find()

     res.status(200).json({
          message : "Posts Fetcheed Successfully",posts
     })
})

module.exports= app