import { Split } from "@geoffcox/react-splitter";

export function CodeEditorSkeleton() {
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
                    <div
                      key={i}
                      className="h-4 bg-gray-200 rounded animate-pulse"
                    ></div>
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
