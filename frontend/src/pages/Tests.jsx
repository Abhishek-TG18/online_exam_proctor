import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, Clock } from "lucide-react";
import { BACKEND_URL } from "../../config";
import { Header } from "../components/Header";
import { ErrorHandler } from "../components/ErrorHandler";
import { TestsSkeleton } from "../components/TestsSkeleton";
import { formatDateTime } from "../utilities/formateDateTime";
import { Footer } from "../components/Footer";

export function Tests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v2/user/tests`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.data.tests) {
          setTests(response.data.tests);
        }
      } catch (err) {
        if (err.response?.data?.message) {
          setMessage(err.response.data.message);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) {
    return <TestsSkeleton />;
  }

  if (error) {
    return <ErrorHandler />;
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <Header userRole="Student" />
        <div className="p-4 sm:p-6">
          <div className="max-w-3xl mx-auto mt-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center sm:text-left">
              Upcoming Tests
            </h1>

            {message ? (
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <p className="text-gray-600 text-center text-sm sm:text-lg">
                  {message}
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {tests.map((test) => {
                  const { date, time } = formatDateTime(test.scheduledOn);
                  return (
                    <div
                      key={test._id}
                      className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-xl font-semibold text-gray-800 capitalize mb-2 sm:mb-0">
                          {test.courseId.title}
                        </h2>
                        <button
                          onClick={() => {
                            if (test.hasChangeOfQuestion) {
                              localStorage.setItem(
                                "hasChangeOfQuestion",
                                "true"
                              );
                            } else {
                              localStorage.removeItem("hasChangeOfQuestion");
                            }
                            navigate(`/test/${test._id}`);
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 w-full sm:w-auto mt-2 sm:mt-0"
                        >
                          Start Test
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-5 w-5" />
                          <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-5 w-5" />
                          <span>{time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
