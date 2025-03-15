import { Menu } from "lucide-react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useState, useEffect } from "react";
import { testResultAtom, timerAtom } from "../store/atoms/atoms";
import { handleFinishTest } from "../utilities/finishTest";
import { useNavigate } from "react-router-dom";

export function TestHeader({ toggleSidebar, isSidebarOpen, id }) {
  const remainingTimeFromAtom = useRecoilValue(timerAtom);
  const [remainingTime, setRemainingTime] = useState(remainingTimeFromAtom);
  const navigate = useNavigate();
  const setTestResult = useSetRecoilState(testResultAtom);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return [
      String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(seconds).padStart(2, "0"),
    ];
  };

  const handleFinish = async () => {
    await handleFinishTest({ navigate, id, setTestResult });
  };

  useEffect(() => {
    if (remainingTime <= 0) {
      handleFinish();
      return;
    }

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          handleFinish();
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime]);

  return (
    <div className="flex items-center justify-between p-4 bg-green-600 text-white h-16">
      <div className="flex justify-center items-center">
        <button
          onClick={toggleSidebar}
          className={`absolute top-4 left-4 p-2 rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-64" : "translate-x-0"
          }`}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="flex items-center space-x-2 mr-8">
        <div className="text-sm font-bold uppercase">Time Remaining:</div>
        <div className="flex justify-center items-center">
          {["HH", "MM", "SS"].map((label, index) => {
            const value = formatTime(remainingTime)[index];
            return (
              <div key={label} className="flex items-center">
                <div className="text-lg font-bold text-green-600 bg-green-100 px-2 py-0 rounded-md mx-1">
                  {value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
