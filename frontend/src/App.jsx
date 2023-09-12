import './App.css';
import UploadFile from './components/upload';
import React from 'react'
import { useState } from 'react';
import MusicGraph from './components/plotly';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {


  const [ data, setData ] = useState(null)
  const [ pieceTitle, setPiece ] = useState("")

  return (
        <Router>
          <Routes>
            <Route path='/' element={<UploadFile setData={setData} setPiece={setPiece} pieceTitle={pieceTitle} />} />
            <Route path='/graph' element={<MusicGraph data={data} pieceTitle={pieceTitle}/>} />
          </Routes>
        </Router>

  );
}

export default App;
