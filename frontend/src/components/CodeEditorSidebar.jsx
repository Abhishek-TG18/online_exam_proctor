import React from "react";
import { Link } from "react-router-dom";
import { ChangeOfQuestion } from "./ChangeOfQuestion";

export const CodeEditorSidebar = ({ testId, onFinishTest, isOpen }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full z-30 transition-transform duration-300 ease-in-out ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={`h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 bg-green-600 text-white h-16">
            <h2 className="text-xl font-semibold text-white">Menu</h2>
          </div>
          <nav className="flex flex-col flex-grow p-4">
            <div className="flex-grow space-y-2">
              <Link
                to={`/question/${testId}`}
                className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                Problem
              </Link>
              <Link
                to={`/viva/${testId}`}
                className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                Start Viva
              </Link>
              <ChangeOfQuestion id={testId} />
            </div>
            <div className="border-t border-gray-200 pt-4 mt-auto flex justify-center">
              <button
                onClick={onFinishTest}
                className="py-1 px-4 border w-full rounded-md transition duration-300 bg-green-500 text-white border-green-500 hover:bg-gray-100 hover:text-green-500"
              >
                Finish Test
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};
