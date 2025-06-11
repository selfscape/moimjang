import { create } from "zustand";

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

interface SystemModalState {
  config: SystemModalConfig;
  open: (cfg: Partial<SystemModalConfig>) => void;
  close: () => void;
  showErrorModal: (errorMessage: string) => void;
  showAnyMessageModal: (anyMessage: string) => void;
}

export const useSystemModalStore = create<SystemModalState>((set, get) => ({
  config: { isOpen: false },
  open: (cfg) =>
    set({
      config: {
        isOpen: true,
        title: cfg.title ?? "",
        message: cfg.message ?? "",
        showCancel: cfg.showCancel ?? false,
        confirmText: cfg.confirmText ?? "확인",
        cancelText: cfg.cancelText ?? "취소",
        onConfirm: cfg.onConfirm,
        onCancel: cfg.onCancel,
      },
    }),
  close: () => set((s) => ({ config: { ...s.config, isOpen: false } })),
  showErrorModal: (errorMessage: string) =>
    set({
      config: {
        isOpen: true,
        title: "🚫 에러 발생.",
        message: errorMessage,
        showCancel: false,
        confirmText: "확인",
        onConfirm: () => get().close(),
      },
    }),
  showAnyMessageModal: (anyMessage: string) =>
    set({
      config: {
        isOpen: true,
        title: anyMessage,
        message: "",
        showCancel: false,
        confirmText: "확인",
        onConfirm: () => get().close(),
      },
    }),
}));
