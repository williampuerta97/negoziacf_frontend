import { AxiosResponse } from "axios";
import { IUser } from "./user.interface";

export interface IAuthContext {
    user: IUser | null;
    isAuthenticated: boolean;
    setUser: (user: IUser | null) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    _login: (username: string, password: string) => Promise<{data: any, status: number}>;
    _logout: () => void;
    error: string | null;
}

export interface IAuthUserResponse {
    ok:   boolean;
    user: IUser;
}

export interface ILoginResponse {
    ok:    boolean;
    token: string;
    user: IUser;
}