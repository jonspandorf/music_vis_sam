import './App.css';
import UploadFile from './components/upload';
import React from 'react'
import { useState } from 'react';
import MusicGraph from './components/plotly';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SingIntervals from './components/intervals/sing';

function App() {


  const [ data, setData ] = useState(null)

  return (
        <Router>
          <Routes>
            <Route path='/main' element={<UploadFile setData={setData} />} />
            <Route path='/graph' element={<MusicGraph data={data} />} />
            <Route path='/intervals' element={<SingIntervals />} />
          </Routes>
        </Router>

  );
}

export default App;
