import './App.css';
import UploadFile from './components/upload';
import React, { useEffect } from 'react'
import { useState } from 'react';
import MusicGraph from './components/graph';
import {  BrowserRouter as Router, Routes, avigate, Outlet, createBrowserRouter, RouterProvider, Route } from 'react-router-dom'
import { getPrivateRoutes } from './routes/private';
import { getPublicRoutes } from './routes/public';
import userpool from './lib/userpool'
import ProtectedRoutes from './routes/protected';
import LoginPage from './components/public/login';
import SignupPage from './components/public/signup';

function App() {


  const [ data, setData ] = useState(null)
  const [ isAuthenticated, setAuthenticated ] = useState(false)

  const checkAuth = () => {
    return new Promise((res,rej) => {
      const user = userpool.getCurrentUser();
      if (!user) res(setAuthenticated(false))
      else res(setAuthenticated(true))
    })
  }


  useEffect(()=>{
    (
      async () => {
        await checkAuth()
      }
    )()
  },[]);

  

  useEffect(()=> {console.log(isAuthenticated)},[isAuthenticated])

  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoutes isAuthenticated={isAuthenticated}/>} >
            <Route path='/main' element={<UploadFile setData={setData}/>} />
            <Route path='/graph' element={<MusicGraph data={data} />}/>
        </Route>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />}/>
      </Routes>
    </Router>
  );
}

export default App;
