import { atom, atomFamily } from "recoil";

export const questionAtomFamily = atomFamily({
  key: "questionAtomFamily",
  default: {
    questionId: null,
    description: "",
    sampleTestCase: null,
  },
});

export const errorAtom = atom({
  key: "errorState",
  default: null,
});
