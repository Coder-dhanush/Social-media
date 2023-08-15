import React, { useEffect } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { Outlet } from 'react-router'
import { useDispatch } from 'react-redux'
import { getMyInfo } from '../../redux/slices/appConfigSlice';

function Home() {
  const dispatch = useDispatch(null);
  useEffect(()=>
  {
    dispatch(getMyInfo())

},[])
  return (
    <>
    <Navbar/>
    <div className="outlet" style={{marginTop:'60px'}}>
    <Outlet/>
    </div>
 
    </>
  )
}

export default Home