import { atom } from "recoil";

export const viewAtom = atom({
  key: "view",
  default: "testcase",
});

export const testInputAtom = atom({
  key: "testInput",
  default: "",
});

export const isRunningAtom = atom({
  key: "isRunning",
  default: false,
});

export const isSubmittingAtom = atom({
  key: "isSubmitting",
  default: false,
});

export const outputAtom = atom({
  key: "output",
  default: "",
});

export const errorAtom = atom({
  key: "error",
  default: "",
});

export const messageAtom = atom({
  key: "message",
  default: "",
});

export const allPassedAtom = atom({
  key: "allPassed",
  default: false,
});

export const failedInputAtom = atom({
  key: "failedInput",
  default: "",
});

export const expectedOutputAtom = atom({
  key: "expectedOutput",
  default: "",
});

export const yourOutputAtom = atom({
  key: "yourOutput",
  default: "",
});

export const erro403Atom = atom({
  key: "403",
  default: false,
});

export const isCheatedAtom = atom({
  key: "cheated",
  default: false,
});

export const findingQuestionAtom = atom({
  key: "COQLOADING",
  default: false,
});

export const sideBarAtom = atom({
  key: "sideBarAtom",
  default: false,
});

export const testResultAtom = atom({
  key: "testResultAtom",
  default: null,
});

export const timerAtom = atom({
  key: "timerAtom",
  default: null,
});

export const submittedAtom = atom({
  key: "submittedAtom",
  default: false,
});
