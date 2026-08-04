const express = require('express')
const multer = require('multer')
const MusicContoller = require("../src/controllers/music.controller")

const upload = multer({
    storage:multer.memoryStorage()
})

const router = express.Router();

router.post('/upload',upload.single('music'), MusicContoller.createMusic)


module.exports=router;