const router = require('express').Router();
const { createPostController, likeAndUnlikeController, updatePostController, deletePostController} = require('../Controllers/postController');
const requireUser = require('../Middlewares/requireUser');

router.post('/',requireUser,createPostController);
router.post('/like',requireUser,likeAndUnlikeController);
router.put('/',requireUser,updatePostController);
router.delete('/',requireUser,deletePostController);






module.exports= router;