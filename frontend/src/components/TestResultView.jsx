import { Check, Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { Pre } from "./Pre";
import { useRecoilValue } from "recoil";
import {
  allPassedAtom,
  errorAtom,
  expectedOutputAtom,
  failedInputAtom,
  isRunningAtom,
  isSubmittingAtom,
  messageAtom,
  outputAtom,
  yourOutputAtom,
} from "../store/atoms/atoms";

export function TestResultView() {
  const [copied, setCopied] = useState(false);
  const isRunning = useRecoilValue(isRunningAtom);
  const isSubmitting = useRecoilValue(isSubmittingAtom);
  const output = useRecoilValue(outputAtom);
  const error = useRecoilValue(errorAtom);
  const message = useRecoilValue(messageAtom);
  const allPassed = useRecoilValue(allPassedAtom);
  const failedInput = useRecoilValue(failedInputAtom);
  const expectedOutput = useRecoilValue(expectedOutputAtom);
  const yourOutput = useRecoilValue(yourOutputAtom);

  const handleCopy = () => {
    navigator.clipboard.writeText(failedInput).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="flex-1 overflow-auto">
      {isRunning || isSubmitting ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="animate-spin" />
        </div>
      ) : output ? (
        <div className="mb-4 text-green-600">
          <h3 className="text-md font-semibold mb-2">Your Output:</h3>
          <Pre text={output} />
        </div>
      ) : error ? (
        <div>
          <h3 className="text-md font-semibold mb-2 text-red-400">Error:</h3>
          <Pre text={error} color={"red"} />
        </div>
      ) : message ? (
        <div className="mx-5">
          <p
            className={
              "font-extrabold text-2xl " +
              (allPassed ? "text-green-500" : "text-red-500")
            }
          >
            {message} !
          </p>
          {!allPassed && (
            <div>
              <h4 className="mt-4 mb-2 font-semibold">Input :</h4>
              <div className="relative bg-gray-100 rounded-md border border-gray-200 p-2">
                <pre className="whitespace-pre-wrap text-sm font-mono overflow-x-auto">
                  <code>{failedInput}</code>
                </pre>
                <button
                  className={`absolute top-1 right-2 p-1 text-gray-400 rounded-md text-xs transition-colors duration-300 ${
                    copied ? "text-sm" : "hover:bg-gray-200"
                  }`}
                  onClick={handleCopy}
                  aria-label="Copy to clipboard"
                  title="Copy to clipboard"
                >
                  {copied ? <Check /> : <Copy />}
                </button>
              </div>
              <h4 className="mt-4 mb-2 font-semibold">Expected Output :</h4>
              <Pre text={expectedOutput ? expectedOutput : " "} />
              <h4 className="mt-4 mb-2 font-semibold">Your Output :</h4>
              <Pre text={yourOutput ? yourOutput : " "} />
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-400 text-sm ml-1 mt-3">
          No results to display. Run the code to see output or error.
        </p>
      )}
    </div>
  );
}
