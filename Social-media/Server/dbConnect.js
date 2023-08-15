const mongoose = require('mongoose');


module.exports = async  ()=> {
    const mongoUrl = 'mongodb+srv://Coder_dhanush:QZEXb6hqbqBYUNGn@cluster0.3kllco2.mongodb.net/?retryWrites=true&w=majority';
    
   await mongoose
   .connect(mongoUrl,{useUnifiedTopology:true,useNewUrlParser:true})
   .then(()=>console.log("Connection successfull")) 
   .catch(err => {console.log(err); return(1)});
}