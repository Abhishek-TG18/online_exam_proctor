import React, { useState } from "react";
import UserSignIn from "../components/UserSignIn";
import UserSignUp from "../components/UserSignUp";
import AdminSignIn from "../components/AdminSignIn";
import AdminSignUp from "../components/AdminSignUp";

export default function AuthPage() {
  const [mode, setMode] = useState("user");
  const [action, setAction] = useState("signin");

  const renderForm = () => {
    switch (`${mode}-${action}`) {
      case "user-signin":
        return <UserSignIn />;
      case "user-signup":
        return <UserSignUp />;
      case "admin-signin":
        return <AdminSignIn />;
      case "admin-signup":
        return <AdminSignUp />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden p-2">
          <div className="flex w-full">
            <button
              onClick={() => setAction("signin")}
              className={`flex-1 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                action === "signin"
                  ? "text-green-600 border-green-600 bg-gray-100"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAction("signup")}
              className={`flex-1 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                action === "signup"
                  ? "text-green-600 border-green-600 bg-gray-100"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>
          <div className="px-6 py-6 sm:px-10">
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
              {mode === "user" ? "Student" : "Teacher"}{" "}
              {action[0].toUpperCase() + action.substring(1)}
            </h2>
            <div className="mt-8">{renderForm()}</div>
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setMode(mode === "user" ? "admin" : "user");
                  setAction("signin");
                }}
                className="text-sm font-medium text-green-600 hover:text-green-500 transition-colors duration-200"
              >
                {mode === "user" ? "Login as Teacher" : "Login as Student"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
