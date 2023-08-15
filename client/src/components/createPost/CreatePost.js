import React, { useState } from 'react'
import Avatar from '../avatar/Avatar';
import './CreatePost.scss'
import {BsCardImage} from 'react-icons/bs'
import { axiosClient } from '../../utils/axiosClient';
import { useDispatch,useSelector } from 'react-redux';
import { getUserProfile } from '../../redux/slices/postsSlice';



function CreatePost() {
const dispatch = useDispatch();
 const [postImg,setPostImg] =useState('');
 const [caption,setCaption] = useState('');
 const myProfile = useSelector(state => state.appConfigReducer.myProfile);


const handleImageChange = (e)=>{

  const file = e.target.files[0];
  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.onload = () =>
  {
    if(fileReader.readyState === fileReader.DONE)
    {
      setPostImg(fileReader.result)
      console.log('img data',fileReader.result)
    }
  }
}

const handlePostSubmit = async () =>{
  try {
    
    const result = await axiosClient.post('/posts',{
      caption,
      postImg
});
console.log('post done',result);
dispatch(getUserProfile(
  {
    userId:myProfile?._id
  }
))
// console.log("I am the next line you see");
  } catch (e) {
    console.log(e);
    // return (e)
  }
  finally{
    setCaption('');
    setPostImg('');
  }
}



  return (
    <div className='CreatePost'>
     <div className="left-part">
        <Avatar src={myProfile?.avatar?.url}/>
     </div>
     <div className="right-part">
        <input type="text" value={caption} className="captionInput" placeholder="What's on your mind" onChange={(e)=>setCaption(e.target.value)} />


       { postImg &&  <div className="img-container">
            <img src={postImg} alt="post Image" className="post-img" />
                </div>}

        <div className="bottom-part">
            <div className="input-post-img">
            <label htmlFor="inputImg" className="labelImg">
            <BsCardImage/>
          </label>
          <input 
         className='inputImg' id="inputImg" type="file" accept="image/*" onChange={handleImageChange}/>
        </div>
        <button className="post-btn btn-primary" onClick={handlePostSubmit}>Post</button>
        </div>
       </div>
     </div>
  )
}

export default CreatePost