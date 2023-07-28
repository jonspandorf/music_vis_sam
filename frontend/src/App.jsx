import './App.css';
import UploadFile from './components/upload';
import React from 'react'
import { Container } from 'react-bootstrap';
import { useState } from 'react';
import MusicGraph from './components/plotly';

function App() {

  const [ data, setData ] = useState(null)

  return (
    <Container>
      {
        !data ? 
          <UploadFile setData={setData}/> : 
          <MusicGraph data={data} />
      }
    </Container>
  );
}

export default App;
