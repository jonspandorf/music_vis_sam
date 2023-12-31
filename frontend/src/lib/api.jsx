import axios from 'axios'

// No URL Attached for CF

const url = process.env.REACT_APP_API || '/api'

export const onPublishScore = async (data, filename, measures) => {

    const res = await axios.put(`${url}/upload?filename=${filename}&${new URLSearchParams(measures).toString()}`, data)
    return res.data

}

export const getScoreGraphData = async (filename) => {
    const res = await axios.get(`${url}/score?${new URLSearchParams({ filename }).toString()}`)
    return res.data
}
