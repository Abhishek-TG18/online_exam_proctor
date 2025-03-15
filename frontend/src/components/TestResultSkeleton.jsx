import { Header } from "./Header";

export function TestResultSkeleton() {
  const SkeletonBar = () => (
    <div className="w-full bg-green-100 rounded-full h-2.5 overflow-hidden">
      <div className="bg-green-300 h-full w-2/3 animate-pulse"></div>
    </div>
  );

  return (
    <div>
      <Header userRole={"Student"} />
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-green-500 text-white py-4">
            <div className="h-8 bg-green-400 w-1/2 mx-auto rounded animate-pulse"></div>
          </div>
          <div className="p-6 space-y-6">
            {[1, 2].map((index) => (
              <div key={index}>
                <div className="h-6 bg-gray-300 w-1/3 mb-2 rounded animate-pulse"></div>
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-200 w-1/4 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 w-1/6 rounded animate-pulse"></div>
                </div>
                <SkeletonBar />
              </div>
            ))}

            <div className="pt-4 border-t border-green-200">
              <div className="h-7 bg-green-200 w-1/3 mb-2 rounded animate-pulse"></div>
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-gray-200 w-1/4 rounded animate-pulse"></div>
                <div className="h-6 bg-green-100 w-1/6 rounded animate-pulse"></div>
              </div>
              <SkeletonBar />
            </div>

            <div className="mt-6 text-center">
              <div className="h-4 bg-gray-200 w-3/4 mx-auto rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 w-2/3 mx-auto mt-2 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
