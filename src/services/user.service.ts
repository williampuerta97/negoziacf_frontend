import negoziaApi from "../api/negoziacfApi";
import { IUpdateUserProp, IUser, IUserDeleteResponse, IUserResponse, IUsers } from "../interfaces";

export const getUsers = () => {
    return negoziaApi.get<IUsers>('user');
}

export const createUser = (user: IUser) => {
    return negoziaApi.post<IUserResponse>('user', user);
}

export const getUser = (id?: string) => {
    return negoziaApi.get<IUserResponse>(`user/${id}`);
}

export const updateUser = (user: IUpdateUserProp, _id?: string) => {
    return negoziaApi.put<IUserResponse>(`user/${_id}`, user);
}

export const deleteUser = (_id?: string) => {
    return negoziaApi.delete<IUserDeleteResponse>(`user/${_id}`);
}