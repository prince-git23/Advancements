const jwt = require("jsonwebtoken");
const musicModel = require("../models/music.model")
const albumModel = require("../models/album.model")
const uploadFile = require("../services/storage.service")

async function createMusic(req, res) {

    const { title } = req.body
    const file = req.file

    const result = await uploadFile(file.buffer.toString('base64'))

    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: req.user.id,

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

async function createAlbum(req, res) {
    const token = req.cookies.token;

    const { title, musics } = req.body;

    const album = await albumModel.create({
        title,
        artist: artist.user.id,
        musics: musics
    })

    res.status(201).json({
        message: "Album Created Successfully",
        album: {
            id: album._id,
            title: album.title,
            artist: album.artist,
            musics: album.musics
        }
    })
}

async function getAllMusic(req,res){
    const musics = await musicModel.find().populate('artist','username email') //populate will display all the details for the artist

    res.status(200).json({
        message:"Musics Fetched SUccessfully",
        musics:musics
    })
}

async function getAllAlbums(req,res){
    const albums = await albumModel.find().select('title artist').populate('artist','username email')

    res.status(200).json({
        message:"Album fetched SUccessfully",
        albums:albums
    })
}

async function getAlbumById(req,res){
    const albumId = req.params.albumId

    const album = await albumModel.findById(albumId).populate("artist","username email")

    return res.status(200).json({
        message:"ALbum fetched Successfully",
        album:album
    })
}

module.exports = { createMusic, createAlbum ,getAllMusic ,getAllAlbums ,getAlbumById}