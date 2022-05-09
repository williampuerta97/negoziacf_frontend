export interface IUser {
    _id?:            string;
    name:            string;
    lastName:        string;
    document_number: string;
    phone:           string;
    email:           string;
    rol?:            string;
    state?:          boolean;
    username:        string;
    password?:        string;
}

export interface IUsers {
    users: IUser[];
    total: number;
}

export interface IUpdateUserProp {
    name:            string;
    lastName:        string;
    document_number: string;
    phone:           string;
}

export interface IUserResponse {
    ok:   boolean;
    user: IUser;
}

export interface IUserDeleteResponse {
    ok:   boolean;
    user: IUser;
    message: string;
}