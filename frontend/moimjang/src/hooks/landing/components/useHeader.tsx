import { useSetRecoilState } from "recoil";
import { headerState, HeaderStateConfig } from "recoils/atoms/landing";

const useHeader = () => {
  const setHeader = useSetRecoilState(headerState);
  const header = (config: Partial<HeaderStateConfig>) => {
    setHeader({
      visible: config.visible,
      title: config.title || "",
      onBack: config.onBack,
    });
  };

  return { header };
};

export default useHeader;
