const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { error, success } = require("../Utils/responseWrapper");
dotenv.config({path:'./.env'});



const signupController = async (req,res)=>
{
    try {
        
        const {email,password,name} = req.body;
        if(!email || !password ||!name)
        {
            // return res.status(400).send('All fields are required');
            return res.send(error(400,'All fields are required'));
        }
        const oldUser = await User.findOne({email});
        if(oldUser)
        {
            // return res.status(409).send('User already regestered');
            return res.send(error(409,'User already regestered'));

        }

        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            email,
            password:hashedPassword,
            name
        })
    //     return res.status(201).json({
    //         user
    //    })
    return res.send(success(201,'user created successfully'));
        
    } catch (e) {
        return res.send(error(500,e.message));
    }
}

const loginController= async (req,res)=>
{
    try {
        const {email,password} = req.body;
        if(!email || !password)
        {
            // return res.status(400).send('All fields are required');
            return res.send(error(400,'All fields are required'));

        }
        const user = await User.findOne({email}).select('+password');
        if(!user)
        {
            // return res.status(404).send('User is not found');
            return res.send(error(404,'User is not found'));

        }
        const matched= await bcrypt.compare(password,user.password);
        if(!matched)
        {
            // return res.status(403).send('Incorrect Password');
            return res.send(error(403,'Incorrect Password'));

        }
        const accessToken = generateAccessToken({_id:user._id});
       const refreshToken = generateRefreshToken({_id:user._id});

       res.cookie('jwt',refreshToken,{
        httpOnly:true,
        secure:true
       });

        // return res.json({accessToken});
        return res.send(success(200,{accessToken})
        );
    } catch (e) {
        return res.send(error(500,e.message));

        
    }
}

const logoutController = async (req,res)=>
{
    try {
        const cookies =req.cookies;
        const refreshToken = cookies.jwt;
        console.log('Refresh token here',refreshToken)
        console.log('I am here vro');
        res.clearCookie('jwt',refreshToken,{
            httpOnly:true,
            secure:true
           })
           return res.send(success(200,'Logged out successfully'));
    } catch (e) {
        return res.send(error(500,e.message));
    }
}

//Api to check the refresh token and then generate a new access token

const refreshAccessTokenController=(req,res)=>
{
    const cookies =req.cookies;
    if(!cookies.jwt)
    {
        // return res.status(401).send('Refresh token is required in cookies');
        return res.send(error(401,'Refresh token is required in cookies'));

    }
    const refreshToken = cookies.jwt;
    
    if(!refreshToken)
    {
        // return res.status(401).send('Refresh token is required');
        return res.send(error(401,'Refresh token is required'));

    }
    try {
        const validity = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_PRIVATE_KEY);
        const _id = validity._id;
        const accessToken = generateAccessToken({_id});
        // return res.status(201).json({newAccessToken});
        return res.send(success(201,{accessToken})
        );
        
       } catch (e) {
        console.log(e);
        // return res.status(401).send('Invalid refresh token');
        return res.send(error(401,'Invalid refresh token'));
       }
}



//internal functions
const generateAccessToken = (data)=>
{
    try {
        const token =jwt.sign(data,process.env.ACCESS_TOKEN_PRIVATE_KEY,{
            expiresIn:'1d',
        });

        console.log(token);
        return token;
    } catch (error) {
        console.log(error);
    }
    
}


const generateRefreshToken = (data)=>
{
    try {
        const token =jwt.sign(data,process.env.REFRESH_TOKEN_PRIVATE_KEY,{
            expiresIn:'1y',
        });

        console.log(token);
        return token;
    } catch (error) {
        console.log(error);
    }
    
}
module.exports = {signupController,loginController,refreshAccessTokenController,logoutController};