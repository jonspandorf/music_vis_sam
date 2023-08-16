import axios from 'axios'

export const onPublishScore = async (data) => {

    const res = await axios.put('/api/upload', data)
    return res.data

}
