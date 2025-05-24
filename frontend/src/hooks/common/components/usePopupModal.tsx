import { useSetRecoilState } from "recoil";
import {
  PopupModalStateConfig,
  popupModalState,
} from "recoils/atoms/common/modal";

const usePopupModal = () => {
  const setModal = useSetRecoilState(popupModalState);

  const openModal = (config: Partial<PopupModalStateConfig>) => {
    setModal({
      isOpen: config.isOpen,
      content: config.content,
      onClose: config.onClose,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  return { openModal, closeModal };
};

export default usePopupModal;
