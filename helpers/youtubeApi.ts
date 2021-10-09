import axios, { AxiosInstance } from "axios";
import { YT_API_KEY } from "../constants/Constants";

const api: AxiosInstance = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    key: YT_API_KEY,
  }
});

export default api;