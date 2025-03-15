import axios from "axios";
import { BACKEND_URL } from "../../config";

export const handleFinishTest = async ({ navigate, id, setTestResult }) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/api/v2/user/test/${id}/finish`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setTestResult(res.data.result);
    navigate(`/result/${id}`);
  } catch (error) {
    console.error("Error finishing the test:", error);
  }
};
