export function VivaSkeleton() {
  return (
    <div className="h-screen bg-white text-black overflow-hidden">
      <div className="ml-0">
        <div className="flex items-center justify-between p-4 bg-green-600 h-16">
          <div className="rounded-md bg-green-500 ml-5 h-6 w-6 animate-pulse"></div>
          <div className="w-16 h-6 bg-green-500 rounded animate-pulse"></div>
        </div>
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="max-w-3xl mx-auto w-full">
            <div className="bg-white rounded-lg shadow-md p-6 w-full">
              <div className="mb-4">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-300 animate-pulse"
                    style={{ width: "50%" }}
                  />
                </div>
              </div>

              <div className="mb-8">
                <div className="text-sm bg-gray-200 h-4 w-24 rounded mb-6 animate-pulse"></div>
                <div className="bg-gray-200 h-6 w-3/4 rounded animate-pulse"></div>
              </div>

              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>

              <div className="mt-6 flex justify-between text-sm">
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-28 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
