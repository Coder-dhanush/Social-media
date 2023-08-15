import React, { useReducer } from 'react'
import './Avatar.scss';
// import from '../'
import userImage from '../../assets/gamer.png';
function Avatar({src}) {
  return (
    <div className='Avatar'>
        <img className='avatar-img' src={src ? src : userImage} alt="user avatar" />
    </div>
  )
}

export default Avatar