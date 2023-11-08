import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket';

export const useScoreChecker = (filename, readyToConnect) => {

  const WS_URL = process.env.REACT_APP_WS_URL 


  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(readyToConnect ? WS_URL : null);
  const [ isReady, setIsReady ] = useState(false)
  const [ resend, setResend ] = useState(true)
  

  const msgToWs = {
    action: 'onCheck',
    filename
  }

  useEffect(() => {
    if (readyState === 1 && resend) {
      sendJsonMessage(msgToWs)
      setResend(false)
    } 
  }, [readyState, resend])

  useEffect(() => {
    (
      async () =>{
        if (readyToConnect && lastMessage) {
          const res = JSON.parse(lastMessage.data)

          if (res.msg === "Your file is ready!") {
            await new Promise((res) => (res(setIsReady(true))))
            setResend(false)
          } else {
            await new Promise(res => setTimeout(res, 20000))
            setResend(true)
          }

      }

    }
    )()
  }, [lastMessage])

  return isReady
}



