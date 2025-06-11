import { create } from "zustand";

type NavigationState = {
  visible: boolean;
  handler: (visible: boolean) => void;
};

const useNavigationStore = create<NavigationState>((set) => ({
  visible: true,
  handler: (visible) => set({ visible }),
}));

export default useNavigationStore;
