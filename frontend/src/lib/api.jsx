import axios from 'axios'

// const url = process.env.REACT_APP_URL || 'http://localhost:3000/'
export const onPublishScore = async (data) => {

    const res = await axios.put(`/api/upload`, data)
    return res.data

}
