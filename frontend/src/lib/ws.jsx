import { useState } from 'react'
import WebSocket from 'ws'

export const getScoreResults = (filename) => {

    const [ scoreData, setScoreData ] = useState([]) 

    let timeoutId
    const ws = new WebSocket('/api/ws/')

    const checkIfDataIsReady = (filename) => {
        const msg = { action: 'onCheck', filename }
        ws.send(JSON.stringify(msg))
    }

    ws.onopen = () => {
        checkIfDataIsReady(filename)
    }

    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
    
        if (399 < data.status < 500) {
          const delayInSeconds = 20; // Initial delay
          timeoutId = setTimeout(checkIfDataIsReady, delayInSeconds * 1000);
        } else {
          console.log('Data is ready:', data);
          setScoreData(data)
          socket.close();
        }
      };
    
      ws.onclose = (event) => {
        if (event.wasClean) {
          console.log('WebSocket closed cleanly, code=' + event.code + ', reason=' + event.reason);
          clearTimeout(timeoutId)
          return scoreData
        } else {
          console.error('WebSocket connection interrupted.');
        }
      };

      ws.onerror = (error) => {
        console.error("ws error: ", error)
        clearTimeout(timeoutId)
      }
}

