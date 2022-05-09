import negoziaApi from "../api/negoziacfApi";
import { IUser } from "../interfaces";

interface IMeResponse {
    ok: boolean;
    user: IUser;
}

const checkToken = (): Promise<{valid: boolean, user?: IUser, status?: number}> => {
    const token = localStorage.getItem("token");

    if (token) {
        return negoziaApi
            .get<IMeResponse>("auth/me", {
                headers: {
                    "x-token": token,
                },
            })
            .then((resp) => {
                if (resp.status === 200 && resp.data.user) {
                    return {
                        valid: true,
                        user: resp.data.user,
                        status: resp.status,
                    };
                } else {
                    return {
                        valid: false,
                    };
                }
            })
            .catch((err) => {
                return {
                    valid: false,
                };
            });
    } else {
        return Promise.resolve({ valid: false });
    }
};

export default checkToken;
