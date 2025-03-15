import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { Header } from "../components/Header";
import { formatDateTime } from "../utilities/formateDateTime";
import { ErrorHandler } from "../components/ErrorHandler";
import { ResultsSkeleton } from "../components/ResultsSkeleton";
import { TableElement } from "../components/TableElement";
import { Footer } from "../components/Footer";

export function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v2/user/results`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setResults(response.data.results);
      } catch (err) {
        if (err.response?.data?.message) {
          setMessage(err.response.data.message);
        } else {
          setError("Failed to fetch results. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const TableHeading = ({ text, className = "" }) => (
    <th
      className={`px-6 py-3 text-center text-sm sm:text-md font-semibold uppercase tracking-wider ${className}`}
    >
      {text}
    </th>
  );

  if (loading) {
    return <ResultsSkeleton />;
  }

  if (error) {
    return <ErrorHandler />;
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <Header userRole={"Student"} />
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Your Results
          </h2>

          {message ? (
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <p className="text-gray-600 text-center text-lg">{message}</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-green-600 text-white border-b-2">
                  <tr>
                    <TableHeading text={"COURSE"} />
                    <TableHeading text={"DATE"} />
                    <TableHeading
                      text={"Coding Score"}
                      className="hidden sm:table-cell"
                    />
                    <TableHeading
                      text={"Viva Score"}
                      className="hidden sm:table-cell"
                    />
                    <TableHeading text={"Score"} />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map((result) => {
                    const { date } = formatDateTime(result.scheduledOn);
                    return (
                      <tr key={result._id} className="hover:bg-gray-50">
                        <TableElement
                          text={
                            result.course[0].toUpperCase() +
                            result.course.substring(1)
                          }
                        />
                        <TableElement text={date} />
                        <TableElement
                          text={result.codingScore}
                          className="hidden sm:table-cell"
                        />
                        <TableElement
                          text={result.vivaScore}
                          className="hidden sm:table-cell"
                        />
                        <TableElement
                          text={result.codingScore + result.vivaScore}
                        />
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
