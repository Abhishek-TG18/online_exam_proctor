import axios from "axios";
import { BACKEND_URL } from "../../config";

export const handleRun = async ({
  id,
  question,
  language,
  version,
  code,
  testInput,
  setters,
}) => {
  const { setIsRunning, setError, setOutput, setView, set403Error } = setters;

  setIsRunning(true);
  setError("");
  setOutput("");
  setView("testresult");
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/v2/user/test/${id}/run`,
      {
        questionId: question.questionId,
        language,
        version,
        code,
        testcase: { input: testInput },
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setIsRunning(false);
    setOutput(response.data.output);
    setError(response.data.error);
  } catch (err) {
    console.error("Error during code execution:", err.message);
    setError(err.message);
    set403Error(true);
  } finally {
    setIsRunning(false);
  }
};
