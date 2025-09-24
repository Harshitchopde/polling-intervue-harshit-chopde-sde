import React, { useState } from "react";

const QuizQuestion = ({ question, options, time, onSubmit }) => {
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setSelected(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) return;
    onSubmit(selected);
    setSubmitted(true);
  };

  return (
    <div className="h-screen flex justify-center items-center bg-white">
      <div className="max-w-md w-full p-6 rounded-xl shadow-lg  text-black">
        {/* Timer */}
        <div className="flex justify-between items-center mb-5">
          <span className="font-semibold">Question 1</span>
          <span className="ml-4 font-medium text-red-500">{time}</span>
        </div>

        {/* Question */}
        <div className="mb-6 bg-gradient-to-r from-[#343434] to-[#6E6E6E] p-2 font-medium text-white rounded-t-lg">
          {question}
        </div>
        {/* Options */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            {options.map((opt) => (
              <label
                key={opt}
                className={`flex items-center cursor-pointer rounded-md px-4 py-3 border transition ${
                  selected === opt
                    ? "border-purple-600 bg-purple-50 text-gray-900"
                    : "border-gray-300 bg-white text-gray-800"
                }`}
              >
                <input
                  type="radio"
                  name="poll-option"
                  value={opt}
                  checked={selected === opt}
                  onChange={handleChange}
                  className="mr-3 accent-purple-600"
                />
                {opt}
              </label>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-6 text-center">
            <button
              type="submit"
              disabled={!selected || submitted}
              className={`bg-purple-600 text-white px-12 py-3 rounded-full text-lg font-medium transition ${
                selected && !submitted
                  ? "hover:bg-purple-700 cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              {submitted ? "Submitted!" : "Submit"}
            </button>
          </div>
        </form>

        {/* Submitted message */}
        {submitted && (
          <div className="mt-4 text-center text-green-500 font-medium">
            Answer submitted successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizQuestion;
