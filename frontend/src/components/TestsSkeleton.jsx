import { Header } from "./Header";

export function TestsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={"Student"} />
      <div className="p-4 sm:p-6">
        <div className="max-w-3xl mx-auto mt-10">
          <div className="flex justify-center sm:block">
            <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-6"></div>
          </div>
          <div className="space-y-5">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="h-7 w-3/4 bg-gray-200 rounded-md animate-pulse mb-2 sm:mb-0"></div>
                <div className="h-10 w-full sm:w-24 bg-gray-200 rounded-md animate-pulse mt-2 sm:mt-0"></div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-5 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="h-7 w-3/4 bg-gray-200 rounded-md animate-pulse mb-2 sm:mb-0"></div>
                <div className="h-10 w-full sm:w-24 bg-gray-200 rounded-md animate-pulse mt-2 sm:mt-0"></div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-5 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="h-7 w-3/4 bg-gray-200 rounded-md animate-pulse mb-2 sm:mb-0"></div>
                <div className="h-10 w-full sm:w-24 bg-gray-200 rounded-md animate-pulse mt-2 sm:mt-0"></div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-5 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
