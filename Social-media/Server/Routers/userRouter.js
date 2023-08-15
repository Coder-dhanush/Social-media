const { followOrUnfollowUserController, getPostsOfFollowingsController,getMyPosts,getUserPosts,deleteMyProfile, getMyInfo,updateUserProfile,getUserProfile} = require('../Controllers/userController');
const requireUser = require('../Middlewares/requireUser');


const router = require('express').Router();


router.post('/follow',requireUser,followOrUnfollowUserController);
router.get('/getFeedData',requireUser,getPostsOfFollowingsController);
router.get('/getMyPosts',requireUser,getMyPosts);
router.get('/getUserPosts',requireUser,getUserPosts);
router.delete('/',requireUser,deleteMyProfile);
router.get('/getMyInfo',requireUser,getMyInfo);
router.put('/',requireUser,updateUserProfile);
router.post('/getUserProfile',requireUser,getUserProfile);




module.exports = router;