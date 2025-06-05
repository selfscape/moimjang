"use client";

import { useEffect } from "react";
import useNavigationStore from "@/app/_store/useNavigationStore";

type Config = {
  visible: boolean;
};

export default function HeaderConfigurator({ config }: { config: Config }) {
  const { handler } = useNavigationStore();

  useEffect(() => {
    handler(config.visible);
    return () => {
      handler(true);
    };
  }, [config.visible]);

  return null;
}
