const express = require('express')
const multer = require('multer')
const MusicContoller = require("../controllers/music.controller")
const AuthMiddleware = require("../middlewares/auth.middleware")

const upload = multer({
    storage:multer.memoryStorage()
})

const router = express.Router();

router.post('/upload',AuthMiddleware.authArtist, upload.single('music'), MusicContoller.createMusic)

router.post('/album',AuthMiddleware.authArtist, MusicContoller.createAlbum)

router.get('/',AuthMiddleware.authUser,MusicContoller.getAllMusic)

router.get('/albums',AuthMiddleware.authUser,MusicContoller.getAllAlbums)

router.get('/albums/:albumId',AuthMiddleware.authUser,MusicContoller.getAlbumById)


module.exports=router;