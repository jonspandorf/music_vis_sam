import MicrophoneStream from 'microphone-stream'
import { getUserMedia } from 'get-user-media-promise'

const SingIntervals = async () => {
    
    const micStream = new MicrophoneStream()
    const stream =  navigator.mediaDevices.getUserMedia()
    micStream.setStream(stream)
}   