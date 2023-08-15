const { mapPostOutput } = require("../Utils/Utils");
const { error,success} = require("../Utils/responseWrapper");
const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require('cloudinary').v2;


const followOrUnfollowUserController = async (req,res)=>
{
   try {
    const {userIdToFollow} = req.body;
    const curUserId = req._id;
    const userToFollow = await User.findById(userIdToFollow);
    const curUser = await User.findById(curUserId);
    
    if(userIdToFollow === curUserId) 
    {
        return res.send(error(409,'Users cannot follow themselves'));
    }
    if(!userToFollow)
    {
        return res.send(error(404,'User is not found to follow'));
    }

    if(curUser.followings.includes(userIdToFollow))
    {
        const followingIndx = await curUser.followings.indexOf(userIdToFollow);
        curUser.followings.splice(followingIndx,1);

        const followerIndex = await userToFollow.followers.indexOf(curUser);
        userToFollow.followers.splice(followerIndex,1);
        
        
    }
    else{
        curUser.followings.push(userIdToFollow);
        userToFollow.followers.push(curUserId);
      
    }
    await userToFollow.save();
    await curUser.save();
    return res.send(success(200,{user:userToFollow}))
   } catch (e) {
    console.log(e);
    return res.send(error(500,e.message));
   }

}

const getPostsOfFollowingsController = async (req,res)=>
{
    try {
        const curUserId= req._id;
    const curUser = await User.findById(curUserId).populate('followings');

    const fullPosts = await Post.find({
        owner:{
         $in:curUser.followings,
        },

    }).populate('owner');
    const posts = fullPosts.map(item => mapPostOutput(item,req._id)).reverse();
    // curUser.posts = posts
    const followingsIds = curUser.followings.map((item) => item._id);
    followingsIds.push(req._id);
    const suggestions = await User.find(
        {
       _id:{
            $nin:followingsIds
        }
    });

    return res.send(success(200,{...curUser._doc,suggestions,posts}));
    } catch (e) {
        return res.send(error(500,e.message));
    }
}

const getMyPosts = async (req,res)=>

{
    try {
        const curUserId = req._id;
        // console.log('Your curUserId is',curUserId);
        const posts = await Post.find({
            owner:curUserId
        }).populate('likes');
    
        return res.send(success(200,{posts}));
        
    } catch (e) {
     return res.send(error(500,e.message));
        
    }
}

const getUserPosts = async (req,res)=>
{
    
    try {
        const userId = req.body.userId;
        if(!userId)
        {
        return res.send(error(400,'UserId is required'));

        }
        // console.log('Your curUserId is',curUserId);
        const posts = await Post.find({
            owner:userId
        }).populate('likes');
    
        return res.send(success(200,{posts}));
        
    } catch (e) {
     return res.send(error(500,e.message));
        
    }

}

const deleteMyProfile = async (req,res)=>
{
    try {
        const curUserId = req._id;
    const curUser =await User.findById(curUserId);


    //deleting the posts
    await Post.deleteMany({
        owner:curUserId
    })

    //removing me from follower's following
    curUser.followers.forEach(async (followerId) =>
        {
            const follower = await User.findById(followerId);
            const indx =   follower.followings.indexOf(curUserId);
            follower.followings.splice(indx,1);
           await follower.save();

        })
     
        //removing my followings
        curUser.followings.forEach(async (followingId) =>
            {
                const following = await User.findById(followingId);
                const indx =   following.followers.indexOf(curUserId);
                following.followers.splice(indx,1);
               await following.save();
    
            })


            //removing likes from all places
            const allPosts = await Post.find();
            allPosts.forEach(async (post) =>
                {
                    const indx= post.likes.indexOf(curUserId);
                    post.likes.splice(indx,1);
                   await post.save();
                })

        //delete user
       await curUser.deleteOne();
       res.clearCookie('jwt',{
        httpOnly:true,
        secure:true
       });
        return res.send(200,'Profile deleted successfully');
        
    } catch (e) {
        console.log(e);
        return res.send(error(500,e.message));
        
    }
}

const getMyInfo = async (req,res)=>
{
    try {
        const userId = req._id;
        const user = await User.findById(userId);
        return res.send(success(200,{user}));
    } catch (e) {
     return res.send(error(500,e.message));
        
    }
}

const updateUserProfile = async (req,res) =>
{
    try {
        const {name,bio,userImg} = req.body;
        const user = await User.findById(req._id);
        if(name)
        {
            user.name=name;
        }
        if(bio)
        {
            user.bio=bio;
        }
        if(userImg)
        {
            const cloudImg = await cloudinary.uploader.upload(userImg,{
                folder:'profileimg'
            })
            if(cloudImg){
            console.log("This is the cloud img",cloudImg);
            }else{
                console.log("No image is found");
            }
            user.avatar={
                publicId:cloudImg.public_id,
                url:cloudImg.secure_url        
            }
        }  
        await user.save();
        return res.send(success(200,{user}));
    } catch (e) {
     return res.send(error(500,e.message));
        
    }
}

const getUserProfile = async (req,res) =>{
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId).populate(
            {
                path:'posts',
                populate:{
                    path:'owner'
                }
            }
        );
        const fullPosts = user.posts;
        const posts = fullPosts.map(item =>
            mapPostOutput(item,req._id)
        ).reverse();
        return res.send(success(200,{...user._doc,posts}))

    } catch (e) {
     return res.send(error(500,e.message));
        
    }
}



module.exports= {followOrUnfollowUserController,getPostsOfFollowingsController
    ,getMyPosts,getUserPosts,deleteMyProfile
    ,getMyInfo,getUserProfile,updateUserProfile};