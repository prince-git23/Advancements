const mongoose = require('mongoose')

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Database")
    }
    catch(err){
        console.error("Database not connected with error:",err)
    }
}

module.exports = connectDB;