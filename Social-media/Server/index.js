const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path:'./.env'});
const dbConnect = require('./dbConnect');
const authRouter = require('./Routers/authRouter');
const postRouter = require('./Routers/postRouter');
const userRouter = require('./Routers/userRouter');
const cloudinary = require('cloudinary').v2;
const cookieParser = require('cookie-parser');
const cors = require('cors');


//configuration  
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY , 
  api_secret: process.env.CLOUDINARY_API_SECRET,

});

const morgan = require('morgan');
const app = express();

//Middlewares
app.use(morgan('common'));
// app.use(express.json());
app.use(express.json({limit:'50mb'}));
app.use(cookieParser());
app.use(cors({origin:'http://localhost:3000', 
credentials:true            //access-control-allow-credentials:true
}));

 


const port=process.env.PORT;
app.use('/auth',authRouter);
app.use('/posts',postRouter);
app.use('/user',userRouter);


app.get('/',(req,res)=>
{
    res.status(200).send('Hello');
})

dbConnect();
app.listen(port,()=>
{
    console.log(`Listening on port:${port}`);
})