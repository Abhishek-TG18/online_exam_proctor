import { useSetRecoilState } from "recoil";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import { questionAtomFamily } from "../store/atoms/programQuestionAtoms";
import { findingQuestionAtom, sideBarAtom } from "../store/atoms/atoms";

export function ChangeOfQuestion({ id }) {
  const setQuestion = useSetRecoilState(questionAtomFamily(id));
  const setLoading = useSetRecoilState(findingQuestionAtom);
  const setIsSidebarOpen = useSetRecoilState(sideBarAtom);

  const onClick = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/api/v2/user/test/${id}/changeofquestion`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.message) {
        alert(response.data.message);
        return;
      }

      const { questionId, description, sampleTestCase } = response.data;
      setQuestion({ questionId, description, sampleTestCase });
    } catch (error) {
      alert(
        error.response.data.message ||
          error.response.data.error ||
          error.message
      );
    } finally {
      setLoading(false);
      setIsSidebarOpen(false);
    }
  };

  return (
    <button
      onClick={onClick}
      className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200 w-full text-left disabled:cursor-not-allowed"
      disabled={localStorage.getItem("hasChangeOfQuestion") !== "true"}
    >
      {localStorage.getItem("hasChangeOfQuestion") === "true"
        ? "Change of question"
        : "Change of question not available"}
    </button>
  );
}
