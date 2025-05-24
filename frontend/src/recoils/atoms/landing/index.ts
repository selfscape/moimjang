import { atom } from "recoil";

export interface HeaderStateConfig {
  visible: boolean;
  title: string;
  onBack?: () => void;
}

export const headerState = atom<HeaderStateConfig>({
  key: "headerState",
  default: {
    visible: false,
    title: "Default Title",
    onBack: undefined,
  },
});
