import { atom } from "recoil";

export interface SaveBarConfig<
  T extends (...args: any[]) => any = (...args: any[]) => any
> {
  isVisible: boolean;
  buttonText?: string;
  onSave?: T;
}

export const saveBarState = atom<SaveBarConfig>({
  key: "saveBarState",
  default: {
    isVisible: false,
    buttonText: "확인",
    onSave: undefined,
  },
});
