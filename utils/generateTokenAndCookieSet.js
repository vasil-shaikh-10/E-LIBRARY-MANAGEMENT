const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')
require('dotenv').config()
const generateTokenAndCookieSet = async(userId,res) =>{
    try {
        let token = await jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'15d'})
        console.log(token)
        res.status(201).cookie("jwt-ELibray",token,{
            maxAge:15 * 24 * 60 * 60 * 1000, // 15 days in MS
            httpOnly:true,
            sameSite:"strict"
        })
        return token;
    } catch (error) {
        console.log("Error in generateTokenAndCookieSet Utils", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
}

module.exports = generateTokenAndCookieSet