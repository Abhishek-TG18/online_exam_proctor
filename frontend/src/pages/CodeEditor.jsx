import { useState } from "react";
import { Split } from "@geoffcox/react-splitter";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ErrorHandler } from "../components/ErrorHandler";
import { useTestState } from "../hooks/useTestState";
import { CodeEditorSidebar } from "../components/CodeEditorSidebar";
import { questionAtomFamily } from "../store/atoms/programQuestionAtoms";
import { CodeEditorSkeleton } from "../components/CodeEditorSkeleton";
import { handleFinishTest } from "../utilities/finishTest";
import { TestHeader } from "../components/TestHeader";
import { ProblemPanel } from "../components/ProblemPanel";
import { OutputPanel } from "../components/OutputPanel";
import { ProgramEditor } from "../components/ProgramEditor";
import {
  erro403Atom,
  findingQuestionAtom,
  isCheatedAtom,
  sideBarAtom,
  submittedAtom,
  testResultAtom,
} from "../store/atoms/atoms";
import { CaughtCheating } from "../components/CaughtCheating";

export function CodeEditor() {
  const { id } = useParams();
  const question = useRecoilValue(questionAtomFamily(id));
  const error403 = useRecoilValue(erro403Atom);
  const isCheated = useRecoilValue(isCheatedAtom);
  const isFinding = useRecoilValue(findingQuestionAtom);
  const submitted = useRecoilValue(submittedAtom);
  const navigate = useNavigate();

  const handleFinish = async () => {
    await handleFinishTest({ navigate, id, setTestResult });
  };

  const { status, isLoading, hasError } = useTestState(id);

  const [isSidebarOpen, setIsSidebarOpen] = useRecoilState(sideBarAtom);

  const setTestResult = useSetRecoilState(testResultAtom);

  if (isLoading || isFinding) {
    return <CodeEditorSkeleton />;
  }
  if (status == "finished") {
    navigate(`/result/${id}`);
  }
  if (hasError || !question?.description || status === "expired" || error403) {
    return <ErrorHandler />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="fixed inset-0 flex lg:hidden items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
          <h2 className="text-xl font-semibold text-red-600 mb-3">
            ⚠️ Warning
          </h2>
          <p className="text-gray-700">
            You can only take tests on laptops or PCs. Mobile devices are not
            supported.
          </p>
          <button
            onClick={() => navigate("/tests")}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Okay
          </button>
        </div>
      </div>
      <div className="h-screen bg-white text-black overflow-hidden hidden lg:block">
        <CodeEditorSidebar
          testId={id}
          onFinishTest={handleFinish}
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
        />
        <div
          className={`transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <TestHeader
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            id={id}
          />
          {isCheated ? (
            <CaughtCheating id={id} />
          ) : (
            <div className="h-screen bg-white text-black p-2">
              <Split
                horizontal={false}
                initialPrimarySize="40%"
                minPrimarySize="20%"
                minSecondarySize="40%"
                splitterSize="4px"
                splitterClassName="bg-green-300 hover:bg-green-500 transition-colors duration-200"
              >
                <Split
                  horizontal={true}
                  initialPrimarySize={submitted ? "20%" : "55%"}
                  minPrimarySize="20%"
                  minSecondarySize="20%"
                  splitterSize="4px"
                  splitterClassName="bg-green-300 hover:bg-green-500 transition-colors duration-200"
                >
                  <ProblemPanel question={question} />
                  <OutputPanel />
                </Split>
                <ProgramEditor id={id} />
              </Split>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
