import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { ReviewField } from "../_model";
import { Draft } from "immer";

type ReviewActions = {
  setField: <K extends keyof ReviewField>(
    field: K,
    value: ReviewField[K]
  ) => void;
  toggleField: (
    field: "style" | "impression" | "conversation" | "keywords",
    value: string
  ) => void;
  reset: () => void;
};

export const useReviewStore = create<ReviewField & ReviewActions>()(
  immer((set) => ({
    selectedParticipant: "",
    style: [],
    impression: [],
    conversation: [],
    keywords: [],
    instagram: "",
    kakao: "",
    phoneNumber: "",
    isAnonymous: false,
    setField: <K extends keyof ReviewField>(field: K, value: ReviewField[K]) =>
      set((state: Draft<ReviewField>) => {
        state[field] = value;
      }),

    toggleField: (field, value) =>
      set((state) => {
        const arr = state[field];
        if (arr.includes(value)) {
          state[field] = arr.filter((v: string) => v !== value);
        } else {
          arr.push(value);
        }
      }),
    reset: () =>
      set((state) => {
        state.selectedParticipant = "";
        state.style = [];
        state.impression = [];
        state.conversation = [];
        state.keywords = [];
        state.instagram = "";
        state.kakao = "";
        state.phoneNumber = "";
        state.isAnonymous = false;
      }),
  }))
);
