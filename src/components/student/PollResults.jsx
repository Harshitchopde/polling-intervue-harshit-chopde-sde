import React from "react";
import { useSelector } from "react-redux";

const PollResults = () => {
  const { pollResults, currentPoll } = useSelector((state) => state.poll);

//   if (!currentPoll) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-white">
//         <p className="text-gray-500 text-lg">
//           Wait for the teacher to ask a new question..
//         </p>
//       </div>
//     );
//   }

  const currentResult = pollResults.find(
    (result) => result.pollId === currentPoll.id
  );

  if (!currentResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <p className="text-gray-500 text-lg">No responses yet...</p>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white">
      {/* Poll Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {currentResult.question}
        </h2>

        <div className="space-y-4">
          {currentResult.options.map((option, idx) => {
            const votes = currentResult.votes[option] || 0;
            const percentage =
              currentResult.totalVotes > 0
                ? (votes / currentResult.totalVotes) * 100
                : 0;

            return (
              <div
                key={idx}
                className="p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">{option}</span>
                  <span className="text-sm font-semibold text-purple-600">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Waiting Message */}
        <p className="text-center text-gray-500 mt-6 text-sm">
          Wait for the teacher to ask a new question..
        </p>
      </div>
    </div>
  );
};

export default PollResults;
