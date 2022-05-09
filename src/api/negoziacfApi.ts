import axios from "axios";

const baseURL = "http://localhost:3003/api/v1/";
const negoziaApi = axios.create({ baseURL });

negoziaApi.interceptors.request.use(async (config:any) => {

  const token = await localStorage.getItem("token");

  if (token) {
    config.headers["x-token"] = token;
    config.headers["Content-Type"] = "application/json";
    config.headers["Accept"] = "application/json";
  }
  return config;
});

export default negoziaApi;
