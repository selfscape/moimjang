import { create } from "zustand";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";

export type RefetchFunction<T = any> = (
  options?: RefetchOptions
) => Promise<QueryObserverResult<T | T[], Error>>;

type HeaderState = {
  visible: boolean;
  title?: string;
  onBack?: boolean;
  onRefresh?: RefetchFunction;
  show: (opts: {
    title: string;
    onBack?: boolean;
    onRefresh?: RefetchFunction;
  }) => void;
  hide: () => void;
};

const useHeaderStore = create<HeaderState>((set) => ({
  visible: false,
  title: undefined,
  onBack: undefined,
  onRefresh: undefined,
  show: ({ title, onBack, onRefresh }) =>
    set({ visible: true, title, onBack, onRefresh }),
  hide: () =>
    set({
      visible: false,
      title: undefined,
      onBack: undefined,
      onRefresh: undefined,
    }),
}));

export default useHeaderStore;
