import { serverUrl } from "configs";

// src/api/cousumer/axiosInstance.ts
import axios from "axios";

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: `${serverUrl}`, // API 서버 URL 입력
  // 기타 공통 설정...
});

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.data &&
      (error.response.data.detail === "유효하지 않은 토큰입니다." ||
        error.response.data.detail === "해당 유저가 존재하지 않습니다.")
    ) {
      // 현재 페이지 URL을 가져와 인코딩합니다.
      const currentUrl = window.location.href;
      // 로그인 페이지로 리다이렉트 하면서 redirectUrl 쿼리 파라미터로 추가합니다.
      window.location.href = `/login?redirectUrl=${encodeURIComponent(
        currentUrl
      )}`;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
