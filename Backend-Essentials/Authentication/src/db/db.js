const mongoose = require('mongoose')

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connect To Database")
    }
    catch(err){
        console.err("Database Not Connected due to:",err)
    }
}

module.exports = connectDB
