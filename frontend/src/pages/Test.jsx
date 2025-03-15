import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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

  const [exitAttempts, setExitAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const fullscreenButtonRef = useRef(null);

  // Function to enter fullscreen
  const enterFullscreen = () => {
    const elem = document.documentElement;
    try {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } catch (error) {
      console.error("Error entering fullscreen:", error);
    }
  };

  // Function to check if we're in fullscreen mode
  const checkFullscreen = () => {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  };

  useEffect(() => {
    // Enter fullscreen initially
    enterFullscreen();
    
    // Function to handle exiting fullscreen
    const handleFullscreenExit = () => {
      if (!checkFullscreen()) {
        setExitAttempts(prev => {
          const newAttempts = prev + 1;
          
          if (newAttempts >= 3) {
            setIsBlocked(true);
            alert("You have exceeded the fullscreen exit limit. You are blocked from the test.");
            return newAttempts;
          }
          
          alert(`Warning: Please stay in fullscreen mode during the test. Attempts: ${newAttempts}/3`);
          return newAttempts;
        });
      }
    };

    // Setup event listeners for fullscreen changes
    document.addEventListener("fullscreenchange", handleFullscreenExit);
    document.addEventListener("webkitfullscreenchange", handleFullscreenExit);
    document.addEventListener("mozfullscreenchange", handleFullscreenExit);
    document.addEventListener("MSFullscreenChange", handleFullscreenExit);

    // Disable copy and paste
    const preventCopyPaste = (e) => {
      e.preventDefault();
      alert("Copy and paste actions are not allowed during this test.");
    };

    document.addEventListener("copy", preventCopyPaste);
    document.addEventListener("paste", preventCopyPaste);
    document.addEventListener("cut", preventCopyPaste);

    // Add context menu prevention
    const preventContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", preventContextMenu);

    // Add keydown prevention for keyboard shortcuts
    const preventKeyboardShortcuts = (e) => {
      // Prevent Ctrl+C, Ctrl+V, Ctrl+X
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
        e.preventDefault();
        alert("Copy and paste actions are not allowed during this test.");
      }
    };

    document.addEventListener("keydown", preventKeyboardShortcuts);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenExit);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenExit);
      document.removeEventListener("mozfullscreenchange", handleFullscreenExit);
      document.removeEventListener("MSFullscreenChange", handleFullscreenExit);
      document.removeEventListener("copy", preventCopyPaste);
      document.removeEventListener("paste", preventCopyPaste);
      document.removeEventListener("cut", preventCopyPaste);
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", preventKeyboardShortcuts);
    };
  }, []);

  // Monitor fullscreen status and re-enter if necessary
  useEffect(() => {
    if (isBlocked) return;

    const checkAndEnterFullscreen = () => {
      if (!checkFullscreen()) {
        enterFullscreen();
      }
    };

    // Check if user has exited fullscreen periodically
    const intervalId = setInterval(checkAndEnterFullscreen, 1000);

    return () => clearInterval(intervalId);
  }, [isBlocked]);

  if (hasError || isBlocked) {
    return <ErrorHandler />;
  }

  if (isLoading || !(timer && status === "scheduled")) {
    return <CodeEditorSkeleton />;
  }

  const handleFullscreenButtonClick = () => {
    enterFullscreen();
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-50 select-none">
        <Header userRole="Student" />
        <div className="flex justify-center items-center min-h-screen mt-20">
          <main className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-3xl sm:text-4xl font-bold text-green-700 mb-6 text-center">
              Lab Test
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-green-600 mb-8 text-center">
              {statusMessage}
            </p>
            <p className="text-red-500 text-center font-semibold">
              (⚠ Do not exit fullscreen mode. Exceeding 3 times will block you!)
            </p>
            <p className="text-red-500 text-center font-semibold">
              Attempts: {exitAttempts}/3
            </p>

            {!checkFullscreen() && (
              <div className="flex justify-center my-4">
                <button
                  ref={fullscreenButtonRef}
                  onClick={handleFullscreenButtonClick}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Return to Fullscreen Mode
                </button>
              </div>
            )}

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