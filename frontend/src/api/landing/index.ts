import axios from "axios";
import { serverUrl } from "configs";

export const axiosInstance = axios.create({
  baseURL: `${serverUrl}`,
});
