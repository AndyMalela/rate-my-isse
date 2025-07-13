const UserModel = require("../models/userModel.js");
const {
  registerUser,
  loginUser,
  logoutUser
} = require("../services/authService.js");
const { authenticateToken } = require('../middleware/authMiddleware.js');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const baseCookieOptions = require('../config/cookieConfig.js');

dotenv.config()


const register = async(req, res )=>{
    const {username, email, password, confirmPassword} =req.body;

    if(!username || !email || !password){
        return res.status(400).json({success:false, message: "All fields are required"});
    }

    //console.log("Password:", password);
    //console.log("Confirm Password:", confirmPassword);
    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const user= new UserModel({username, email, password});

    try{
        const response=await registerUser(user);
        if(response.success===true){
            return res.status(201).json(response)
        }else{
            return res.status(400).json(response)
        }
    }catch(error){
        console.error("Caught unexpected error in register controller:", error);
        return res.status(500).json({ success: false, message: "An internal server error occurred during registration" });
    }
}

const login=async(req, res) => {
    const {email, password, keepLoggedIn} = req.body;
    if(!email || !password){
        return res.status(400).json({success: false, message: "All fields are required"})
    }

    try {
        const response=await loginUser(email, password, res, keepLoggedIn);
        if(response.success===true){    
            res.cookie('authToken', response.token, {
                ...baseCookieOptions,
                maxAge: response.cookieOptions.maxAge,
            })
            return res.status(200).json({ 
                success: true, 
                message: "Login Successful",
                user: {
                    id: response.user.id,
                    name: response.user.name,
                    email: response.user.email
                }
            })
        }else{
            return res.status(400).json(response)
        }
    } catch (error) {
        console.error("Login error:", error); 
        return res.status(500).json({ success: false, message: "Internal server error during login" });
    }
}

const logout=(req, res)=>{
    try {
        const response= logoutUser(res);
        return res.status(200).json({ success: true, message: response.message });
    } catch (error) {
        console.error("Caught unexpected error in logout controller:", error);
        return res.status(500).json({ success: false, message: "An internal server error occurred during logout" });
    }
}

const getMe = (req, res) => {
    if (req.user) {
        return res.status(200).json({ success: true, data: req.user });
    }else{
        return res.status(401).json({ success: false, message: "User not found" });
    }
}

const updateName = (req, res) => {
    const userId = req.params.id;
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    UserModel.updateNameById(userId, name, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Failed to update name' });
        res.json({ success: true, ...result });
    });
};


module.exports = {register, login, logout, getMe, updateName}