import { Navigate } from "react-router-dom"
import LoginPage from "../components/public/login"
import SignupPage from "../components/public/signup"
import Layout from "./layout"

export const getPublicRoutes = () => {

    return [
        { path: '/login', element: <LoginPage />},
        { path: '/signup', element: <SignupPage />},
        { path: "*", element: <Navigate to="/login" replace /> },
    ]
    
}

