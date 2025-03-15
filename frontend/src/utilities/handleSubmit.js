import axios from "axios";
import { BACKEND_URL } from "../../config";

export const handleSubmit = async ({
  id,
  question,
  language,
  version,
  code,
  setters,
  codeLength,
  keyStrokeCount,
}) => {
  const {
    setIsSubmitting,
    setView,
    setFailedInput,
    setExpectedOutput,
    setYourOutput,
    setOutput,
    setError,
    setMessage,
    setAllPassed,
    set403Error,
    setIsCheated,
    setSubmitted,
  } = setters;

  setIsSubmitting(true);
  try {
    setView("testresult");
    const response = await axios.post(
      `${BACKEND_URL}/api/v2/user/test/${id}/submit`,
      {
        questionId: question.questionId,
        language,
        version,
        code,
        codeLength,
        keyStrokeCount,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data.isCheated) {
      setIsCheated(true);
      return;
    }

    setSubmitted(true);

    if (!response.data.allPassed) {
      for (var i = 0; i < response.data.results?.length; i++) {
        if (!response.data.results[i].Accepted) {
          setFailedInput(response.data.results[i].input);
          setExpectedOutput(response.data.results[i].expected);
          setYourOutput(response.data.results[i].output);
          break;
        }
      }
    }

    setOutput(response.data.output);
    setError(response.data.error);
    setMessage(response.data.message);
    setAllPassed(response.data.allPassed);
    setIsSubmitting(false);
  } catch (err) {
    console.error("Error during code submission:", err.message);
    set403Error(true);
    setError(err.message);
    setSubmitted(false);
  } finally {
    setIsSubmitting(false);
  }
};
