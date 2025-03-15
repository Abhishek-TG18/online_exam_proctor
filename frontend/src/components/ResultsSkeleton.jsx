import { Header } from "../components/Header";

export function ResultsSkeleton({ userRole }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={userRole} />
      <div className="container mx-auto px-4 py-8">
        <div className="h-10 w-64 bg-gray-200 rounded-md mb-8 mx-auto"></div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-green-600">
              <tr>
                {[
                  "Course",
                  "Date",
                  "Coding Score",
                  "Viva Score",
                  "Total Score",
                ].map((header) => (
                  <th key={header} className="px-6 py-3">
                    <div className="h-4 bg-green-300 rounded-md w-3/4"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
