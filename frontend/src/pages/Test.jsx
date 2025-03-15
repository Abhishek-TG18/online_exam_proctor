import { useParams } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useTestState } from "../hooks/useTestState";
import { ErrorHandler } from "../components/ErrorHandler";
import { Header } from "../components/Header";
import { CodeEditorSkeleton } from "../components/CodeEditorSkeleton";
import { TickingClock } from "../components/TickingClock";
import { Footer } from "../components/Footer";

export function Test() {
  const { id } = useParams();
  const { status, timer, isLoading, hasError, statusMessage } = useTestState(
    id || ""
  );

  if (hasError) {
    return <ErrorHandler />;
  }

  if (isLoading || !(timer && status === "scheduled")) {
    return <CodeEditorSkeleton />;
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <Header userRole="Student" />
        <div className="flex justify-center items-center min-h-screen mt-20">
          <main className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-3xl sm:text-4xl font-bold text-green-700 mb-6 text-center">
              Lab Test
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-green-600 mb-8 text-center">
              {statusMessage}
            </p>

            <div className="flex flex-col sm:grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
              <div className="col-span-5 bg-white p-6 rounded-lg shadow-md flex justify-center my-8 sm:my-0">
                {timer && status === "scheduled" && (
                  <div className="flex flex-col items-center justify-center">
                    <TickingClock />
                    <div className="text-xl font-semibold text-green-700 text-center mt-4">
                      <p className="mb-2">Time until start:</p>
                      <div className="flex space-x-2">
                        <span className="bg-green-100 rounded-lg px-3 py-1">
                          {timer.hours}h
                        </span>
                        <span className="bg-green-100 rounded-lg px-3 py-1">
                          {timer.minutes}m
                        </span>
                        <span className="bg-green-100 rounded-lg px-3 py-1">
                          {timer.seconds}s
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="hidden col-span-1 md:flex justify-center">
                <div className="h-full w-px bg-gray-200"></div>
              </div>

              <div className="col-span-6 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-4 flex items-center">
                  <Info className="w-6 h-6 mr-2" />
                  Test Information
                </h2>
                <ul className="space-y-3 text-gray-700 text-sm sm:text-lg">
                  <li className="flex items-center">
                    <Clock className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                    <span>Duration: 2 hours</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                    <span>Total Marks: 15 (10 for coding + 5 for viva)</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Scoring:
                      <ul className="list-disc list-inside ml-5 mt-2">
                        <li>100% test cases passed: 10 marks</li>
                        <li>≥50% test cases passed: 5 marks</li>
                        <li>&lt;50% test cases passed: 0 marks</li>
                      </ul>
                    </span>
                  </li>
                  <li className="flex items-center">
                    <XCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                    <span>5 viva questions (1 mark each) after coding</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg shadow-md my-10 sm:my-0">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold text-orange-700 mb-2">
                    Important Notice
                  </h2>
                  <p className="text-sm text-orange-600 mb-3">
                    To maintain academic integrity, please adhere to the
                    following rules:
                  </p>
                  <ul className="list-disc text-sm list-outside ml-5 text-orange-600 space-y-1">
                    <li>Do not copy and paste code during this test</li>
                    <li>
                      Your program score will be marked as 0 if caught doing so
                    </li>
                    <li>You may face further disciplinary action</li>
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
