import { AlertOctagon, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CaughtCheating({ id }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 transition-all duration-300 ease-in-out">
        <div className="flex items-center justify-center mb-6">
          <AlertOctagon className="w-16 h-16 text-red-500 mr-4" />
          <h1 className="text-3xl font-bold text-red-700">
            Cheating Detected!
          </h1>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-xl text-gray-800 font-semibold">
            We regret to inform you that cheating has been detected during your
            examination.
          </p>
          <div className="bg-red-100 border-l-4 border-red-500 p-4">
            <p className="text-red-700 font-medium">
              As a result of this violation:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-red-600">
              <li>You cannot submit your answer anymore.</li>
              <li>Your program score will be marked as 0.</li>
            </ul>
          </div>
          <p className="text-gray-600">
            Cheating undermines the integrity of the examination process and is
            a serious offense. Please be aware that this incident will be
            reported and may have further consequences.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate(`/viva/${id}`)}
            className="py-3 px-4 border border-red-500 text-red-500 rounded-md hover:bg-gray-100 transition duration-300 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Attend Viva
          </button>
        </div>
      </div>
    </div>
  );
}
