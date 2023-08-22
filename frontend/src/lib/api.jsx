import axios from 'axios'

// No URL Attached for CF

const url = process.env.REACT_APP_API || 'http://localhost:3000/'

export const onPublishScore = async (data) => {

    const res = await axios.put(`${url}api/upload`, data)
    return res.data

}
