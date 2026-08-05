const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const bycrypt = require('bcryptjs')

async function registerUSer(req,res){

    const {username,email,password,role="user"} = req.body

    const isUserAAlreadyExist = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    })

    if(isUserAAlreadyExist){
        res.status(409).json({
            message : "User Already Exists."
        })
    }

    const hash = await bycrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password:hash,
        role
    })

    const token = jwt.sign({
        id : user._id,
        role: user.role
    },process.env.JWT_SECRET)

    res.cookie("token",token)

    res.status(201).json({
        message:"User created Successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            role:user.role
        }
    })
}

async function loginUser(req,res){
    const {username, email, password} = req.body

    const user = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if(!user){
        return res.status(401).json({
            message:"Invalid Credentials"
        })
    }

    const isPaswordValid = await bycrypt.compare(password,user.password)

    if(!isPaswordValid){
        return res.status(401).json({message:"Invalid Credentials"})
    }

    const token = jwt.sign({
        id : user._id,
        role: user.role
    },process.env.JWT_SECRET)

    res.cookie("token",token)

    res.status(200).json({message:"Registered Successfully"})
}

async function logoutUser(req,res) {
    res.clearCookie('token')
    res.status(200).json({message:"User Log Out Successfully"})    
}

module.exports= {registerUSer ,loginUser ,logoutUser}