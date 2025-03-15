import { FilePenLine } from "lucide-react";
import { useState } from "react";
import { testInputAtom } from "../store/atoms/atoms";
import { useRecoilState } from "recoil";

export function TestcaseView() {
  const [isEditing, setIsEditing] = useState(false);
  const [testInput, setTestInput] = useRecoilState(testInputAtom);

  return (
    <div className="flex flex-col space-y-4 mx-1">
      <h3 className="text-md font-semibold text-green-400">Test Input:</h3>
      {isEditing ? (
        <textarea
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
          className="p-2 border border-gray-400 rounded-md w-full text-sm"
          rows={4}
        />
      ) : (
        <div className="relative">
          <pre className="p-2 bg-gray-100 border border-gray-200 rounded-md text-sm whitespace-pre-wrap pr-10">
            {testInput}
          </pre>
          <button
            className="absolute top-2 right-2 p-1 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            onClick={() => setIsEditing(true)}
          >
            <FilePenLine className="w-4 h-4 text-green-900 hover:text-green-500 font-extrabold" />
          </button>
        </div>
      )}
      {isEditing && (
        <button
          className="mt-2 py-1 px-4 w-32 border border-green-500 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
          onClick={() => setIsEditing(false)}
        >
          Save Input
        </button>
      )}
    </div>
  );
}
