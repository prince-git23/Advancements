const jwt = require("jsonwebtoken");
const musicModel = require("../models/music.model")
const albumModel = require("../models/album.model")
const uploadFile = require("../services/storage.service")

async function createMusic(req, res) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorised Access dont have token" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role != "artist") {
            return res.status(403).json({ message: "You Can't Create Music" })
        }


        const {title} = req.body
        const file = req.file

        const result = await uploadFile(file.buffer.toString('base64'))

        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: decoded.id,
        })

        res.status(201).json({
            message: "Music Created Successfully",
            music: {
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist
            }
        })
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({ message: "Unauthorised Access" })
    }
}

async function createAlbum(req,res){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"Unauthorized Access-No Token"
        })
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(decoded.role!="artist"){
            return res.status(403).json({
                message:"Unauthorized Access to access music"
            })
        }

        const {title,musics}=req.body;

        const album = await albumModel.create({
            title,
            artist:decoded.id,
            musics:musics
        })

        res.status(201).json({
            message:"Album Created Successfully",
            album:{
                id:album._id,
                title:album.title,
                artist:album.artist,
                musics:album.musics
            }
        })
    }
    catch(err){
        console.log(err)
        return res.status(401).json({message:"Unauthorized Access"})
    }
}

module.exports = { createMusic , createAlbum}