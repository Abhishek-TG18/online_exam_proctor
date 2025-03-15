import { useRecoilValue, useSetRecoilState } from "recoil";
import { Header } from "../components/Header";
import { testResultAtom } from "../store/atoms/atoms";
import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorHandler } from "../components/ErrorHandler";
import { TestResultSkeleton } from "../components/TestResultSkeleton";
import { Footer } from "../components/Footer";

export function TestResult() {
  const result = useRecoilValue(testResultAtom);
  const setResult = useSetRecoilState(testResultAtom);
  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const { id: testId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResult = async () => {
      if (!result) {
        try {
          const response = await axios.get(
            `${BACKEND_URL}/api/v2/user/test/${testId}/result`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (response.data.result) {
            setResult(response.data.result);
          } else {
            setMessage(response.data.message);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setError(error.response.data.error);
          } else {
            setError("An unexpected error occurred.");
          }
        } finally {
          setLoading(false);
        }
      }
    };

    if (!result) {
      fetchResult();
    }
  }, [result, setResult, testId]);

  if (loading) {
    return <TestResultSkeleton />;
  }

  if (error) {
    return <ErrorHandler />;
  }

  if (message) {
    return navigate(`/test/${testId}`);
  }

  const codingScore = result?.codingScore || 0;
  const vivaScore = result?.vivaScore || 0;
  const totalScore = codingScore + vivaScore;
  const maxCodingScore = 10;
  const maxVivaScore = 5;
  const maxTotalScore = maxCodingScore + maxVivaScore;

  const ProgressBar = ({ value, max }) => (
    <div className="w-full bg-green-100 rounded-full h-2.5">
      <div
        className="bg-green-500 h-2.5 rounded-full"
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
  );

  return (
    <div>
      <Header userRole={"Student"} />
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-green-500 text-white py-4">
            <h2 className="text-2xl font-bold text-center">Test Result</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Coding Score
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Score: {codingScore}/{maxCodingScore}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  {((codingScore / maxCodingScore) * 100).toFixed(0)}%
                </span>
              </div>
              <ProgressBar value={codingScore} max={maxCodingScore} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Viva Score
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Score: {vivaScore}/{maxVivaScore}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  {((vivaScore / maxVivaScore) * 100).toFixed(0)}%
                </span>
              </div>
              <ProgressBar value={vivaScore} max={maxVivaScore} />
            </div>

            <div className="pt-4 border-t border-green-200">
              <h3 className="text-xl font-bold text-green-700 mb-2">
                Total Score
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Score: {totalScore}/{maxTotalScore}
                </span>
                <span className="text-lg font-bold text-green-700">
                  {((totalScore / maxTotalScore) * 100).toFixed(0)}%
                </span>
              </div>
              <ProgressBar value={totalScore} max={maxTotalScore} />
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Great job on completing your test! Your performance shows
                promising results.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
