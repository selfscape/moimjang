import { atom } from "recoil";

export interface HeaderStateConfig {
  visible: boolean;
  title: string;
  onBack?: () => void;
  onRefresh?: () => void;
}

export interface NavigationState {
  visible: boolean;
}

// 기본 상태값 설정
export const headerState = atom<HeaderStateConfig>({
  key: "headerState",
  default: {
    visible: true,
    title: "Default Title",
    onBack: undefined,
    onRefresh: undefined,
  },
});

export const navigationState = atom<NavigationState>({
  key: "navigationState",
  default: {
    visible: true,
  },
});
