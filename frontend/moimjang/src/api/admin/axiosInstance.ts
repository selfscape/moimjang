import { serverUrl } from "configs";
import axios from "axios";

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: `${serverUrl}`,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.detail === "유효하지 않은 토큰입니다."
    ) {
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
