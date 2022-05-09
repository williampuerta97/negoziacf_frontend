import negoziaApi from "../api/negoziacfApi"
import { ILoginResponse } from "../interfaces";

export const login = async (username: string, password: string) => {
    return negoziaApi.post<ILoginResponse>("auth/login", { username, password });
}