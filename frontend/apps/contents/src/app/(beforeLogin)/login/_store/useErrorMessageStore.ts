import { create } from "zustand";

type ErrorState = {
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
  clearErrorMessage: () => void;
};

const useErrorMessageStore = create<ErrorState>((set) => ({
  errorMessage: "",
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  clearErrorMessage: () => set({ errorMessage: "" }),
}));

export default useErrorMessageStore;
