import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import userpool from "../lib/userpool";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null)

    const navigate = useNavigate()

    const loginUser = (cognitoLogin) => {
        const data = cognitoLogin()
        setUser(data)
        navigate('/main')
    }

    const logoutUser = (cognitoLogout) => {
        cognitoLogout()
        setUser(null)
        navigate('/login', { replace: true })
    }

    const authValues = useMemo(() => ({
        user,
        loginUser,
        logoutUser
    }), [user])

    return <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext)
}