"use client";

import { useEffect } from "react";
import useHeaderStore, { RefetchFunction } from "../../store/useHeaderStore";

type Config = {
  title: string;
  onBack?: boolean;
  onRefresh?: RefetchFunction;
};

export default function HeaderConfigurator({ config }: { config: Config }) {
  const { show, hide } = useHeaderStore();

  useEffect(() => {
    show({
      title: config.title,
      onBack: config.onBack,
      onRefresh: config.onRefresh,
    });
    return () => {
      hide();
    };
  }, [config, show, hide]);

  return null;
}
