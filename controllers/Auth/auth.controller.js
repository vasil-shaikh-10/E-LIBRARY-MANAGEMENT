const User = require("../../models/Auth/auth.models");
const generateTokenAndCookieSet = require("../../utils/generateTokenAndCookieSet");

const register = async(req,res)=>{
    try {
        let {username,email,password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({success:false,message:"All Fields Are Required"})
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({success:false,message:"Invalid Email"})
        }

        if(password.length < 6 ){
            return res.status(400).json({success:false,message:"Password must be at least 6 characters"})
        }

        let ExitsEmail = await User.findOne({email:email})
        if(ExitsEmail){
            return res.status(400).json({success:false,message:"Email already exists"})
        }

        const UserObj = new User({
            username,
            email,
            password
        })
        generateTokenAndCookieSet(UserObj._id,res)
        await UserObj.save()
        res.status(201).json({success:true,user:{
            ...UserObj._doc,
            password:""
        }})
    } catch (error) {
        console.log("Error in register controller", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
}

const login = async(req,res)=>{
    try {
        let {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({success:false,message:"All Fields Are Required"})
        }

        let ExitsEmail = await User.findOne({email:email})
        if(ExitsEmail == null){
            res.status(201).send({success:false,message:'Email Not Match..'});
        }
        const isMatchPassword = await ExitsEmail.comparePassword(password)
        if(isMatchPassword){
            generateTokenAndCookieSet(ExitsEmail._id,res)
            res.status(201).json({success:true,user:{
                ...ExitsEmail._doc,
                password:""
            }})
        }else{
            res.status(404).send({success:false,message:'Password Not Match.'})
        }
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({success:false,message:"Interna; Server Error"})
    }
}

module.exports = {register,login}