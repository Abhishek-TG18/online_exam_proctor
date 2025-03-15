import { selectorFamily } from "recoil";
import axios from "axios";
import { BACKEND_URL } from "../../../config";
import { currentQuestionIndexAtom } from "../atoms/vivaAtoms";

export const vivaQuestionsSelectorFamily = selectorFamily({
  key: "vivaQuestionsSelectorFamily",
  get: (testId) => async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/v2/user/test/${testId}/viva-questions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.scheduledStart || response.data.result) {
        return response.data;
      }

      return {
        questions: response.data.questions || [],
        totalQuestions: response.data.questions.length || 0,
      };
    } catch (error) {
      console.error("Error fetching viva questions:", error);
      throw error;
    }
  },
});

export const currentQuestionSelectorFamily = selectorFamily({
  key: "currentQuestionSelectorFamily",
  get:
    (testId) =>
    ({ get }) => {
      const currentIndex = get(currentQuestionIndexAtom);
      const questionsData = get(vivaQuestionsSelectorFamily(testId));
      return questionsData.questions[currentIndex] || null;
    },
});

export const totalQuestionsSelector = selectorFamily({
  key: "totalQuestionsSelector",
  get:
    (testId) =>
    ({ get }) => {
      const questionsData = get(vivaQuestionsSelectorFamily(testId));
      if (questionsData.scheduledStart || questionsData.result) {
        return questionsData;
      }

      return questionsData.totalQuestions;
    },
});
