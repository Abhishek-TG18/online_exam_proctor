import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { fetchQuestionSelector } from "../store/selectors/programQuestionSelectors";
import {
  errorAtom,
  questionAtomFamily,
} from "../store/atoms/programQuestionAtoms";
import { timerAtom } from "../store/atoms/atoms";

export const useTestState = (id) => {
  const [status, setStatus] = useState("loading");
  const [timer, setTimer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Loading...");

  const navigate = useNavigate();
  const setQuestionState = useSetRecoilState(questionAtomFamily(id));
  const setError = useSetRecoilState(errorAtom);
  const questionDataLoadable = useRecoilValueLoadable(
    fetchQuestionSelector(id)
  );
  const setTimerAtom = useSetRecoilState(timerAtom);

  useEffect(() => {
    let timerId;

    const initializeTest = async () => {
      if (questionDataLoadable.state === "loading") {
        setIsLoading(true);
        setStatusMessage("Loading...");
        return;
      }

      try {
        if (questionDataLoadable.state === "hasValue") {
          const data = questionDataLoadable.contents;
          if (data.result) {
            setStatus("finished");
            navigate(`/result/${id}`);
          } else {
            setQuestionState((prevState) => {
              if (!prevState.questionId) {
                return {
                  questionId: data.questionId,
                  description: data.description,
                  sampleTestCase: data.sampleTestCase,
                };
              }
              return prevState;
            });

            const scheduledStart = DateTime.fromISO(data.scheduledStart, {
              zone: "Asia/Kolkata",
            });
            const scheduledEnd = scheduledStart.plus({ hours: 2 });
            const now = DateTime.now().setZone("Asia/Kolkata");

            if (now < scheduledStart) {
              setStatus("scheduled");
              setStatusMessage("Test is scheduled in the future.");

              timerId = setInterval(() => {
                const currentTime = DateTime.now().setZone("Asia/Kolkata");
                const remainingTime = scheduledStart
                  .diff(currentTime, ["hours", "minutes", "seconds"])
                  .toObject();
                remainingTime.seconds = Math.floor(remainingTime.seconds || 0);
                setTimer(remainingTime);

                if (currentTime >= scheduledStart) {
                  clearInterval(timerId);
                  setStatus("active");
                  setStatusMessage("Test is now ongoing.");
                  window.location.reload();
                  navigate(`/question/${id}`);
                }
              }, 1000);
            } else if (now > scheduledEnd) {
              setStatus("expired");
              setStatusMessage(
                "This test can only be run or submitted during its scheduled time."
              );
              setHasError(true);
            } else {
              const remainingTime = Math.max(
                Math.floor(scheduledEnd.diff(now, "seconds").seconds),
                0
              );
              setTimerAtom(remainingTime);
              setStatus("active");
              setStatusMessage("Test is now ongoing.");
              navigate(`/question/${id}`);
            }
          }
        } else if (questionDataLoadable.state === "hasError") {
          const error = questionDataLoadable.contents;
          setError(error);
          setHasError(true);
          setStatusMessage(
            "This test can only be run or submitted during its scheduled time."
          );

          if (error.response?.status === 403) {
            setStatus("expired");
            if (!localStorage.getItem("token")) {
              navigate("/login");
              return;
            }
          }
        }
      } catch (error) {
        console.error("Error in test initialization:", error);
        setError(error);
        setHasError(true);
        setStatusMessage(
          "This test can only be run or submitted during its scheduled time."
        );
      } finally {
        if (questionDataLoadable.state !== "loading") {
          setIsLoading(false);
        }
      }
    };

    initializeTest();

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [
    questionDataLoadable,
    setQuestionState,
    setError,
    id,
    navigate,
    setTimerAtom,
  ]);

  return {
    status,
    timer,
    isLoading: isLoading || questionDataLoadable.state === "loading",
    hasError,
    statusMessage,
    handleTestNavigation: () => {
      if (status === "active") {
        navigate(`/question/${id}`);
      }
    },
  };
};
