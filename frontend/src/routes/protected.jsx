import { Navigate, Outlet } from "react-router-dom";


export default function ProtectedRoutes({ isAuthenticated }) {
    console.log(isAuthenticated)
    return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}