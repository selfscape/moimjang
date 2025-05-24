import { atom } from "recoil";
import { User } from "interfaces/user";

// User 타입 정의

// 로그인한 유저 데이터를 저장하는 atom
const userState = atom<User | null>({
  key: "userState",
  default: null, // 기본값을 null로 설정
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      // 1. 초기값을 localStorage에서 불러오기
      const savedUserData = localStorage.getItem("userData");
      if (savedUserData) {
        setSelf(JSON.parse(savedUserData)); // 문자열을 객체로 변환하여 설정
      }

      // 2. userState가 변경될 때 localStorage에 저장
      onSet((newUserData) => {
        if (newUserData) {
          localStorage.setItem("userData", JSON.stringify(newUserData)); // 객체를 문자열로 변환하여 저장
        } else {
          localStorage.removeItem("userData"); // 로그아웃 시 로컬스토리지에서 제거
        }
      });
    },
  ],
});

export default userState;
