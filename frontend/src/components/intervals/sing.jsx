import { useRef, useState } from 'react'
import { Button } from 'react-bootstrap'

const mimeType = "audio/webm";


const SingIntervals = async () => {

    // const [ permission, setPermission ] = useState(false)
    // const [ stream, setStream ] = useState(null)
    // const mediaRecorder = useRef(null)


    // const startStreaming = () => {
    //     const media = new MediaRecorder(stream, { type: mimeType });
    //     mediaRecorder.current = media 

    //     mediaRecorder.current.start()
    //     mediaRecorder.current.ondataavailable = (e) => {
    //         console.log(e.data)
    //     }
    // }

    // const getUserMic =  () => {
    
    //     if ("MediaRecorder" in window) {
    //         try {
    //             const micStream =  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    //             setPermission(true)
    //             setStream(micStream)
    //         } catch (err) {
    //             console.error(err)
    //         }
    //     } else {
    //         console.log("Media Recorder is not supported in your browser")
    //     }
    // }



    return (
        <>
        <h4>Sing Intervals</h4>
        {
            // !permission ? (
            //     <Button onClick={getUserMic}>Get Microphone</Button>
            // ) : null
        }
        {/* {
            permission ? (
                <Button type="button" onClick={startStreaming}>Sing</Button> 
            ): null
        } */}
        </>
    )
}   

export default SingIntervals