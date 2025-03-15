import { AlertTriangle, ArrowLeft, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "./Header";

export function ErrorHandler() {
  const navigate = useNavigate();

  return (
    <div>
      <Header userRole={"Student"} />
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4 animate-fadeIn">
        <div className="animate-scaleIn">
          <AlertTriangle className="w-24 h-24 text-red-500 mb-8" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-fadeInUp">
          403 Error
        </h1>
        <p className="text-xl text-green-600 mb-8 text-center animate-fadeInUp delay-100">
          Oops! Something went wrong.
        </p>
        <p className="text-gray-600 mb-8 text-center max-w-md animate-fadeInUp delay-200">
          This could be due to insufficient privileges or an expired session.
          Please try logging in again or contact the administrator if the
          problem persists.
        </p>
        <div className="flex space-x-4 delay-300">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg transition duration-300 ease-in-out hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transform hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg transition duration-300 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transform hover:scale-105 active:scale-95"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
