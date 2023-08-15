const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');
const { error } = require('../Utils/responseWrapper');
dotenv.config({path:'./.env'});
module.exports = async (req,res,next)=>
{
   if(!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith("Bearer"))
   {
   //  res.status(401).send('Authorization header is required');
      return res.send(error(401,'Authorization header is required'));
   }
   const accessToken= req.headers.authorization.split(" ")[1];
   try {
    const validity = jwt.verify(accessToken,process.env.ACCESS_TOKEN_PRIVATE_KEY);
    req._id=validity._id;
   //  console.log('i am inside requireUser',req._id);
   const user = await User.findById(req._id);
   if(!user)
   {
      return res.send(error(404,'User is not present'));
   }
    next();
   } catch (e) {
    console.log(e);
   //  return res.status(401).send('Invalid access token');
    return res.send(error(401,'Invalid access token'));

   }
 
}