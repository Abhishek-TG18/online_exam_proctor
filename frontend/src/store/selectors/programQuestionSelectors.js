import axios from "axios";
import { selectorFamily } from "recoil";
import { BACKEND_URL } from "../../../config";

export const fetchQuestionSelector = selectorFamily({
  key: "fetchQuestion",
  get: (id) => async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authorization token found");
      }

      const response = await axios.get(
        `${BACKEND_URL}/api/v2/user/test/${id}/question`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching question:", error);
      throw error;
    }
  },
});
