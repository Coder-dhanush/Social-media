const mongoose = require('mongoose');
const post = require('./Post')

const userSchema = mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            lowercase:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
            select:false
        },
        name:{
            type:String,
            required:true,
        },
        bio:{
         type:String
        },
        avatar:{
            publicId:String,
            url:String
        },
        followers:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'user'
            }
        ],
        followings:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'user'
            }
        ],
        posts:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'post'

            }
        ]
    },
    {
        timestamps:true,
    }
)


module.exports = mongoose.model('user',userSchema);