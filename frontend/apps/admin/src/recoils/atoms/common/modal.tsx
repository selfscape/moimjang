import React from "react";
import { atom } from "recoil";

export interface SystemModalConfig {
  isOpen: boolean;
  title?: string;
  message?: string;
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const systemModalState = atom<SystemModalConfig>({
  key: "systemModalState",
  default: {
    isOpen: false,
    title: "",
    message: "",
    showCancel: false,
    confirmText: "확인",
    cancelText: "취소",
    onConfirm: undefined,
    onCancel: undefined,
  },
});

export interface PopupModalStateConfig {
  isOpen: boolean;
  content: React.ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
}
export const popupModalState = atom<PopupModalStateConfig>({
  key: "popupModalState",
  default: {
    isOpen: false,
    content: <></>,
    onConfirm: undefined,
    onClose: undefined,
  },
});
