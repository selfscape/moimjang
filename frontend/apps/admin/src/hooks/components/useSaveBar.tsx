import { useSetRecoilState, useRecoilState } from "recoil";
import { saveBarState, SaveBarConfig } from "recoils/atoms/saveBar";

const useSaveBar = () => {
  const setSaveBar = useSetRecoilState(saveBarState);

  const showSaveBar = (config: Partial<SaveBarConfig>) => {
    setSaveBar({
      isVisible: config.isVisible,
      onSave: config.onSave,
      buttonText: config.buttonText,
    });
  };

  const closeSaveBar = () => {
    setSaveBar((prev) => ({ ...prev, isVisible: false }));
  };

  return { showSaveBar, closeSaveBar };
};

export default useSaveBar;
