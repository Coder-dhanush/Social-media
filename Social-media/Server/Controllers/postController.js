const { mapPostOutput } = require("../Utils/Utils");
const { error, success } = require("../Utils/responseWrapper");
const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require('cloudinary').v2;




const createPostController = async (req,res)=>
{
    try {
        const {caption,postImg} = req.body;
        
      
      if(!caption || !postImg) 
      {
        return res.send(error(400,'Caption and postImg is required'));
      }
      
        const cloudImg = await cloudinary.uploader.upload(postImg,{
            folder:'postImg'
        })
        
      
     const owner = req._id;
    const user = await User.findById(owner);
    const post = await Post.create({
        owner,
        caption,
        image:{
            publicId:cloudImg.public_id,
            url:cloudImg.url
        },
    });

    user.posts.push(post._id);
    await user.save();

    return res.send(success(201,post));

    } catch (e) {
      return  res.send(error(500,e.message));
        
    }
}

const likeAndUnlikeController = async (req,res)=>
{
   try {
    const {postId} = req.body;
    const curUserId= req._id;
    
    const post = await Post.findById(postId).populate('owner');
    if(!post)
    {
        return res.send(error(404,'Post not found'));
    }
    if(post.likes.includes(curUserId))
    {
        const indx = post.likes.indexOf(curUserId);
        post.likes.splice(indx,1);
    }
    else{
        post.likes.push(curUserId);
    }
    await post.save();
    return res.send(success(200, {post: mapPostOutput(post,req._id)}));

   } catch (e) {
    return res.send(error(500,e.message));
   }

}

const updatePostController = async(req,res)=>
{
   try {
    const {postId,caption} = req.body;
    const curUserId = req._id;
    const post= await Post.findById(postId);
    if(!post) 
    {
        return res.send(error(404,'Post not found'));
    }
    if(post.owner.toString()!==curUserId)
    {
        return res.send(error(403,'Only owners can update their posts'));
    }
    if(caption){
    post.caption = caption;
    }
    await post.save();
    return res.send(success(200,'Post updated successfully'));
   } catch (e) {
     return res.send(error(500,e.message));
   }
}

const deletePostController = async (req,res)=>
{
    try {
        const {postId} = req.body;
    const curUserId = req._id;
    const curUser = await User.findById(curUserId);
    const post= await Post.findById(postId);
    if(!post) 
    {
        return res.send(error(404,'Post not found'));
    }
    if(post.owner.toString()!==curUserId)
    {
        return res.send(error(403,'Only owners can delete their posts'));
    }
    const indx = curUser.posts.indexOf(postId);
    curUser.posts.splice(indx,1);
    await curUser.save();
    await post.deleteOne();

    return res.send(success(200,'Post deleted successfully'));
    } catch (e) {
     return res.send(error(500,e.message));
         
    }
    
}



module.exports = {createPostController,likeAndUnlikeController,updatePostController,deletePostController};