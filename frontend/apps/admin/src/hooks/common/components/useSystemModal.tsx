import { useSetRecoilState } from "recoil";
import {
  systemModalState,
  SystemModalConfig,
} from "recoils/atoms/common/modal";

const useSystemModal = () => {
  const setModal = useSetRecoilState(systemModalState);

  const openModal = (config: Partial<SystemModalConfig>) => {
    setModal({
      isOpen: config.isOpen,
      title: config.title || "",
      message: config.message || "",
      showCancel: config.showCancel || false,
      confirmText: config.confirmText || "확인",
      cancelText: config.cancelText || "취소",
      onConfirm: config.onConfirm,
      onCancel: config.onCancel,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const showErrorModal = (errorMessage: string) => {
    setModal((prev) => ({
      ...prev,
      isOpen: true,
      showCancel: false,
      title: "🚫 에러 발생.",
      confirmText: "확인",
      message: `${errorMessage}`,
    }));
  };

  const showAnyMessageModal = (anyMessage: string) => {
    setModal((prev) => ({
      ...prev,
      isOpen: true,
      showCancel: false,
      confirmText: "확인",
      title: `${anyMessage}`,
      message: "",
      onConfirm: closeModal,
    }));
  };

  return { openModal, closeModal, showErrorModal, showAnyMessageModal };
};

export default useSystemModal;
