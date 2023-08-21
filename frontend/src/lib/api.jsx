import axios from 'axios'

// No URL Attached for CF

export const onPublishScore = async (data) => {

    const res = await axios.put(`/api/upload`, data)
    return res.data

}
