import {
  useRecoilValueLoadable,
  useRecoilState,
  useSetRecoilState,
} from "recoil";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  currentQuestionSelectorFamily,
  totalQuestionsSelector,
} from "../store/selectors/vivaSelectors";
import {
  currentQuestionIndexAtom,
  questionStateFamily,
} from "../store/atoms/vivaAtoms";
import { ErrorHandler } from "../components/ErrorHandler";
import { CodeEditorSidebar } from "../components/CodeEditorSidebar";
import { TestHeader } from "../components/TestHeader";
import { VivaSkeleton } from "../components/VivaSkeleton";
import { handleFinishTest } from "../utilities/finishTest";
import { Progress } from "../components/Progress";
import { handleVivaSubmit } from "../utilities/handleVivaSubmit";
import { erro403Atom, testResultAtom } from "../store/atoms/atoms";

export function Viva() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentQuestionLoadable = useRecoilValueLoadable(
    currentQuestionSelectorFamily(id)
  );
  const totalQuestionsLoadable = useRecoilValueLoadable(
    totalQuestionsSelector(id)
  );

  const [currentIndex, setCurrentIndex] = useRecoilState(
    currentQuestionIndexAtom
  );

  const [error403, set403Error] = useRecoilState(erro403Atom);

  const setTestResult = useSetRecoilState(testResultAtom);

  const currentQuestion =
    currentQuestionLoadable.state === "hasValue"
      ? currentQuestionLoadable.contents
      : null;
  const [questionState, setQuestionState] = useRecoilState(
    questionStateFamily(currentQuestion?._id)
  );

  useEffect(() => {
    if (
      totalQuestionsLoadable.state === "hasValue" &&
      totalQuestionsLoadable.contents.scheduledStart
    ) {
      navigate(`/test/${id}`);
    } else if (
      totalQuestionsLoadable.state === "hasValue" &&
      totalQuestionsLoadable.contents.result
    ) {
      navigate(`/result/${id}`);
    }
  }, [
    totalQuestionsLoadable.state,
    totalQuestionsLoadable.contents,
    navigate,
    id,
  ]);

  if (currentQuestionLoadable.state === "loading") {
    return <VivaSkeleton />;
  }

  if (
    currentQuestionLoadable.state === "hasError" ||
    totalQuestionsLoadable.state === "hasError" ||
    error403
  ) {
    return <ErrorHandler />;
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">No questions available</div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFinish = async () => {
    await handleFinishTest({ navigate, id, setTestResult });
  };

  const isLastQuestion =
    currentIndex ===
    (totalQuestionsLoadable.state === "hasValue"
      ? totalQuestionsLoadable.contents
      : 0) -
      1;
  const progressPercentage =
    ((currentIndex + 1) /
      (totalQuestionsLoadable.state === "hasValue"
        ? totalQuestionsLoadable.contents
        : 1)) *
    100;

  return (
    <div className="h-screen bg-white text-black overflow-hidden">
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

        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="max-w-3xl mx-auto w-full">
            <div className="bg-white rounded-lg shadow-md p-6 w-full">
              <Progress progressPercentage={progressPercentage} />

              <div className="mb-8">
                <div className="text-sm text-gray-500 mb-2">
                  Question {currentIndex + 1} of{" "}
                  {totalQuestionsLoadable.state === "hasValue"
                    ? totalQuestionsLoadable.contents
                    : 0}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentQuestion.question}
                </h2>
              </div>

              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={option._id}
                    onClick={() =>
                      handleVivaSubmit({
                        selectedAnswer: option.text,
                        id,
                        isSubmitting,
                        setIsSubmitting,
                        currentQuestion,
                        setQuestionState,
                        currentIndex,
                        setCurrentIndex,
                        totalQuestionsLoadable,
                        set403Error,
                      })
                    }
                    disabled={questionState.answered || isSubmitting}
                    className={`w-full text-left p-4 rounded-lg border ${
                      questionState.selectedAnswer === option.text
                        ? "bg-gray-50 border-gray-500"
                        : "border-gray-200 hover:bg-gray-50"
                    } transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        <span className="text-gray-500 mr-2">{index + 1}.</span>
                        {option.text}
                      </span>
                      {isSubmitting &&
                        questionState.selectedAnswer === option.text && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                    </div>
                  </button>
                ))}
              </div>

              {isLastQuestion && questionState.answered && (
                <div className="mt-8 flex justify-between">
                  <div className="mt-6 flex justify-between text-sm text-gray-500">
                    <div>
                      {isLastQuestion
                        ? "Last question"
                        : `${
                            totalQuestionsLoadable.state === "hasValue"
                              ? totalQuestionsLoadable.contents -
                                (currentIndex + 1)
                              : 0
                          } questions remaining`}
                    </div>
                  </div>
                  <button
                    onClick={handleFinish}
                    className="py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Finish Test
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
