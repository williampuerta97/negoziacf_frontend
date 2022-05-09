import React, { ReactNode, useState } from "react";
import { IAuthContext, IUser } from "../interfaces";
import { login } from '../services'

const AuthContext = React.createContext({} as IAuthContext);

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const _login = async (username: string, password: string) => {
        setLoading(true);
        
        return login(username, password).then(({ data, status }) => {
            localStorage.setItem('token', data.token);
            setIsAuthenticated(true);
            setUser(data.user);
            setLoading(false);

            return {
                data, 
                status
            };
        }).catch(({ response }) => {
            setLoading(false);
            return {
                data: response.data,
                status: response.status
            };
        });
    }

    const _logout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        setUser(null);
    }

    return { 
        isAuthenticated, 
        setIsAuthenticated,
        user,
        setUser,
        _login, 
        _logout,
        error,
        setError,
        loading,
        setLoading
    };
}

export const AuthProvider = ({ children }: { children: ReactNode}) => {
    const auth = useAuth();

    return  <AuthContext.Provider 
                value={{...auth}}
            >
                {children}
            </AuthContext.Provider>;
}

const useAuthContext = () => {
    return React.useContext(AuthContext);
}

export default useAuthContext;