import React, { useEffect,useState} from 'react'
import  './Profile.scss';
import Post from '../post/Post';
import {useNavigate,useParams} from 'react-router';
import CreatePost from '../createPost/CreatePost';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../../redux/slices/postsSlice';
import { followAndUnfollowUser } from '../../redux/slices/feedSlice';


function Profile() {
  const navigate = useNavigate();
  const params = useParams();
  const userProfile = useSelector(state => state.postsReducer.userProfile);
  const myProfile = useSelector(state => state.appConfigReducer.myProfile);
  const feedData = useSelector(state => state.feedDataReducer.feedData);

  const dispatch = useDispatch();
  const [isMyProfile,setIsMyProfile] = useState(true);
  const [isFollowing,setIsFollowing] = useState(false);
 
  useEffect(()=>{
   dispatch(getUserProfile({
    userId:params.userId
   }));

   setIsMyProfile(myProfile?._id === params.userId);
   setIsFollowing(feedData?.followings?.find(item => item._id === params.userId));

 
  },[isMyProfile,params.userId,feedData])

  function handleUserFollow() {
    dispatch(followAndUnfollowUser({
      userIdToFollow:params.userId
  })
  )}

  // console.log('This is the first post and data',userProfile.posts);

  return (
    <div className='Profile'>
    <div className="container">
      <div className="left-side">
     {isMyProfile && <CreatePost/>}
         {userProfile?.posts?.map(singlePost => <Post key={singlePost._id} post={singlePost}/>)}
      </div>
      <div className="right-side">
      <div className="profile-card">
        <img src={userProfile?.avatar?.url} alt="" className='user-img' />
        <h4 className="user-name">{userProfile?.name}</h4>
        <p className='bio'>{userProfile?.bio}</p>
        <div className="follower-info">

          <h4>{`${userProfile?.followers?.length} Followers`}</h4>
          <h4>{`${userProfile?.followings?.length} Followings`}</h4>
        </div>
        {!isMyProfile &&   ( <h5 style={{marginTop:'10px'}}
        onClick={handleUserFollow}
    className={isFollowing ? "follow-link hover-link" : "btn-primary"}>{isFollowing ? 'Unfollow' : 'Follow'}</h5>)
    }
        {isMyProfile &&  <button className='update-profile btn-secondary' onClick={()=>navigate("/updateProfile")}>Update Profile</button>}
      </div>
      </div>
    </div>
    </div>
  )
}

export default Profile