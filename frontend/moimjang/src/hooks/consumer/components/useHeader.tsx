import { useSetRecoilState } from "recoil";
import { headerState, HeaderStateConfig } from "recoils/atoms/consumer";

const useHeader = () => {
  const setHeader = useSetRecoilState(headerState);
  const header = (config: Partial<HeaderStateConfig>) => {
    setHeader({
      visible: config.visible,
      title: config.title || "",
      onBack: config.onBack,
      onRefresh: config.onRefresh,
    });
  };

  return { header };
};

export default useHeader;
