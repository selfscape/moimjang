import { atom } from "recoil";
import { User } from "interfaces/user";

const userState = atom<User | null>({
  key: "userState",
  default: null,
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      const savedUserData = localStorage.getItem("userData");
      if (savedUserData) {
        setSelf(JSON.parse(savedUserData));
      }

      onSet((newUserData) => {
        if (newUserData) {
          localStorage.setItem("userData", JSON.stringify(newUserData));
          localStorage.removeItem("userData");
        }
      });
    },
  ],
});

export default userState;
