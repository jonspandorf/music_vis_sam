import { Navigate } from 'react-router-dom'
import MusicGraph from '../components/graph'
import UploadFile from '../components/upload'
import Layout from './layout'

export const getPrivateRoutes = () => {
    console.log('returning private routes')
    return {
        element: <Layout />,
        children: [
            { path: '/main', element: <UploadFile /> },
            { path: '/graph', element: <MusicGraph /> },
            { path: "*", element: <Navigate to="/login" replace /> },
        ]
    } 
}

