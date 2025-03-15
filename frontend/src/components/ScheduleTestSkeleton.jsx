import { Header } from "./Header";

export function ScheduleTestSkeleton() {
  return (
    <div>
      <Header userRole={"Teacher"} />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <div>
            <div className="h-9 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="space-y-6">
              <div>
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>

              <div>
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
                <div>
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
              </div>

              <div>
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-2 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>

              <div className="flex items-center">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2 ml-2 animate-pulse"></div>
              </div>
            </div>

            <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
