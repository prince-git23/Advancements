const {ImageKit} = require('@imagekit/nodejs')

const ImageKitClient = new ImageKit({
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY
})

async function UploadFile(file) {
    const result = await ImageKitClient.files.upload({
        file,
        fileName:"music_" + Date.now(),
        folder : "Spotify/musics"
    })
    return result
}

module.exports = UploadFile