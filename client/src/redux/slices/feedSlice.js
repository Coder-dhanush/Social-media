import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {axiosClient} from '../../utils/axiosClient';
import { likeAndUnlikePost } from "./postsSlice";

export const getFeedData = createAsyncThunk('user/getFeedData', async ()=>
{
    try {
        
        const response= await axiosClient.get('/user/getFeedData');
        console.log('user Profile',response);
          return response.result;
        
    } catch (e) {
        return Promise.reject(e);
    }
  

})

export const followAndUnfollowUser = createAsyncThunk('user/followAndUnfollow', async (body,thunkApi)=>
{
    try {
         const response=await axiosClient.post('/user/follow',body);
        // console.log('follow data',response);
         return response.result.user;
        
    } catch (e) {
        return Promise.reject(e);
    }
    

})

const feedSlice = createSlice({
    name: 'feedSlice',
    initialState:{
       feedData:{}
    },
    
    extraReducers: (builder) =>{
        builder
        .addCase(getFeedData.fulfilled, (state,action)=>
        {
            state.feedData= action.payload;
        })
        .addCase(likeAndUnlikePost.fulfilled, (state,action)=>
        {
            const post = action.payload;
            // console.log('Liked post',post);
            const index = state.feedData?.posts?.findIndex(item => item._id === post._id);
            if(index!=undefined && index != -1)
            {
                state.feedData.posts[index]=post;
            }
        })
        .addCase(followAndUnfollowUser.fulfilled, (state,action)=>
        {
            const user = action.payload;
            const index = state?.feedData?.followings?.findIndex(item => item._id == user._id);
            if(index!=-1)
            {

                state?.feedData.followings.splice(index,1);
                console.log("user unfollowed");
            }else{
                state?.feedData.followings.push(user);
                console.log("user followed");

            }
        })
       
    }

})

export default feedSlice.reducer;
