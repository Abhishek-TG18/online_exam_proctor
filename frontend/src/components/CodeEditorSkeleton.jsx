import { useEffect, useState, useRef } from "react";
import { Split } from "@geoffcox/react-splitter";

export function CodeEditorSkeleton() {
  const [exitCount, setExitCount] = useState(0);
  const maxExits = 3;
  const fullscreenAttemptRef = useRef(null);

  useEffect(() => {
    // Clear any existing interval to prevent multiple instances
    if (fullscreenAttemptRef.current) {
      clearInterval(fullscreenAttemptRef.current);
    }

    // Function to request fullscreen
    const enterFullscreen = () => {
      if (!document.fullscreenElement) {
        const element = document.documentElement;
        const requestMethod = element.requestFullscreen || 
                              element.webkitRequestFullscreen || 
                              element.mozRequestFullScreen || 
                              element.msRequestFullscreen;
        
        if (requestMethod) {
          try {
            requestMethod.call(element);
          } catch (err) {
            console.error("Error attempting to enable fullscreen:", err);
          }
        }
      }
    };

    // Initial fullscreen request
    enterFullscreen();

    // Setup persistent fullscreen monitoring
    function setupFullscreenMonitoring() {
      // Clear any existing interval
      if (fullscreenAttemptRef.current) {
        clearInterval(fullscreenAttemptRef.current);
      }

      // Continuously check and attempt to restore fullscreen
      fullscreenAttemptRef.current = setInterval(() => {
        if (!document.fullscreenElement && document.visibilityState === "visible") {
          enterFullscreen();
        }
      }, 1000); // Check every second
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // User switched tabs
        const newCount = exitCount + 1;
        setExitCount(newCount);
        
        if (newCount < maxExits) {
          // Wait for user to return to tab
          const warningTimeout = setTimeout(() => {
            alert(`Warning: You have switched tabs ${newCount} time(s). After ${maxExits} violations you will be blocked.`);
            setupFullscreenMonitoring(); // Restart monitoring after alert
          }, 500);
          
          return () => clearTimeout(warningTimeout);
        } else if (newCount >= maxExits) {
          alert("You have been blocked from the exam due to multiple violations.");
          // In a real app, you'd handle navigation with useNavigate/router
          window.location.href = "/blocked";
        }
      } else if (document.visibilityState === "visible") {
        // User returned to tab - ensure fullscreen
        enterFullscreen();
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        // User exited fullscreen
        const newCount = exitCount + 1;
        setExitCount(newCount);
        
        if (newCount < maxExits) {
          // Show warning and force fullscreen
          alert(`Warning: You have exited fullscreen ${newCount} time(s). After ${maxExits} violations you will be blocked.`);
          
          // Set up multiple attempts to re-enter fullscreen
          setupFullscreenMonitoring();

          // Immediate attempt after alert
          setTimeout(enterFullscreen, 100);
          setTimeout(enterFullscreen, 500);
          setTimeout(enterFullscreen, 1000);
        } else if (newCount >= maxExits) {
          alert("You have been blocked from the exam due to multiple violations.");
          // In a real app, you'd handle navigation with useNavigate/router
          window.location.href = "/blocked";
        }
      }
    };

    // Set up initial fullscreen monitoring
    setupFullscreenMonitoring();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      // Clean up all event listeners and intervals
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
      
      if (fullscreenAttemptRef.current) {
        clearInterval(fullscreenAttemptRef.current);
      }
    };
  }, [exitCount, maxExits]);

  return (
    <div className="h-screen bg-white text-black overflow-hidden">
      <div className="ml-0">
        <div className="flex items-center justify-between p-4 bg-green-600 h-16">
          <div className="rounded-md bg-green-500 ml-5 h-6 w-6 animate-pulse"></div>
          <div className="w-16 h-6 bg-green-500 rounded animate-pulse"></div>
        </div>

        <div className="h-[calc(100vh-4rem)] bg-white text-black">
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
              initialPrimarySize="55%"
              minPrimarySize="40%"
              minSecondarySize="20%"
              splitterSize="4px"
              splitterClassName="bg-green-300 hover:bg-green-500 transition-colors duration-200"
            >
              <div className="h-full p-4 overflow-auto">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                  <div className="mt-10">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mt-4 mb-2"></div>
                    <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mt-4 mb-2"></div>
                    <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="h-full p-4 flex flex-col">
                <div className="ml-5 mb-4 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="flex-1 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </Split>

            <div className="h-screen p-4">
              <div className="flex items-center space-x-2 mb-4 mr-3">
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-grow"></div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-[calc(100%-4rem)] bg-gray-200 rounded animate-pulse"></div>
            </div>
          </Split>
        </div>
      </div>
    </div>
  );
}