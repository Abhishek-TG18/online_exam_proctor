import { atom, atomFamily } from "recoil";

export const questionStateFamily = atomFamily({
  key: "questionStateFamily",
  default: (questionId) => ({
    answered: false,
    selectedAnswer: null,
  }),
});

export const currentQuestionIndexAtom = atom({
  key: "currentQuestionIndexAtom",
  default: 0,
});

export const questionAtomFamily = atomFamily({
  key: "questionAtomFamily",
  default: null,
});
