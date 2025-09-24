import React, { useState } from "react";

const DEFAULT_TIMES = [30, 60, 90, 120];

const PollCreator = ({ socket }) => {
  const [question, setQuestion] = useState("");
  const [maxTime, setMaxTime] = useState(60);
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  const addOption = () =>
    setOptions([...options, { text: "", isCorrect: false }]);

  const updateOption = (idx, field, val) => {
    const copy = [...options];
    copy[idx][field] = val;
    setOptions(copy);
  };

  const handleCreatePoll = () => {
    if (!question.trim() || options.filter((o) => o.text.trim()).length < 2) {
      alert("Provide a question and at least 2 options.");
      return;
    }
    const pollData = {
      question,
      options: options.map((o) => o.text.trim()),
      correct: options.map((o) => o.isCorrect),
      maxTime,
    };
    socket?.emit("create-poll", pollData);
    setQuestion("");
    setOptions([
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
    setMaxTime(60);
  };
  const updateOptionText = (idx, val) => {
    const copy = [...options];
    copy[idx].text = val;
    setOptions(copy);
  };
  const updateOptionCorrect = (idx, val) => {
    const copy = [...options];
    copy[idx].isCorrect = val;
    setOptions(copy);
  };
  return (
  <div className="min-h-screen bg-white flex items-center justify-center  ">
  <div className="bg-white mx-auto my-0 rounded-xl shadow-md p-5 text-left">
    {/* Header */}
    <div className="mb-4 text-left">
      <span className="bg-[#4F0DCE] text-white px-4 py-1 rounded-full text-sm font-semibold">
        Intervue Poll
      </span>
    </div>

    {/* Title & Description */}
    <h2 className="mb-1 text-2xl font-normal">
      Let’s <span className="font-bold">Get Started</span>
    </h2>
    <p className="text-gray-500 mb-6 text-base">
      you’ll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
    </p>

    {/* Poll Form */}
    <form className="mb-8">
        <div className="flex justify-between mb-2">
            <label className="block font-semibold text-base mb-2">
        Enter your question
      </label>
             <select
          value={maxTime}
          onChange={(e) => setMaxTime(parseInt(e.target.value))}
          className="h-8 rounded-md px-2 text-sm border border-gray-300 bg-gray-200"
        >
          {DEFAULT_TIMES.map((sec) => (
            <option key={sec} value={sec}>
              {sec} seconds
            </option>
          ))}
        </select>
        </div>
      
      <div className="flex gap-3 mb-2">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={2}
          maxLength={100}
          placeholder="Type your poll question…"
          className="flex-1 resize-none p-4 bg-gray-100 rounded-md border-none outline-none text-base text-gray-900"
        />
       
      </div>
      <div className="text-right text-gray-400 text-sm mb-3">
        {question.length}/100
      </div>

      {/* Options */}
      <div className="flex justify-between">
        <div className="font-semibold text-base mb-2">Edit Options</div>
      <span className="font-bold min-w-[94px] text-sm">Is it Correct?</span>
      </div>
      {options.map((opt, idx) => (
        <div
          key={idx}
          className="flex items-center gap-4 mb-4 bg-gray-50 rounded-md p-3"
        >
          <span className="font-medium text-base">{idx + 1}.</span>
          <input
            type="text"
            value={opt.text}
            onChange={(e) => updateOptionText(idx, e.target.value)}
            placeholder={`Option ${idx + 1}`}
            className="flex-1 px-3 py-2 bg-gray-200 rounded-md border border-gray-300 text-sm"
          />
          <label className="mr-1 text-sm flex items-center">
            <input
              type="radio"
              checked={opt.isCorrect === true}
              onChange={() => updateOptionCorrect(idx, true)}
              name={`correct-${idx}`}
              className="mr-1"
            />
            Yes
          </label>
          <label className="text-sm flex items-center">
            <input
              type="radio"
              checked={opt.isCorrect === false}
              onChange={() => updateOptionCorrect(idx, false)}
              name={`correct-${idx}`}
              className="mr-1"
            />
            No
          </label>
        </div>
      ))}
      <button
        type="button"
        onClick={addOption}
        className="mt-1 text-purple-600 bg-purple-50 rounded-md px-4 py-2 font-medium text-base cursor-pointer"
      >
        + Add More option
      </button>
    </form>

    {/* Submit Button */}
    <div className="text-right">
      <button
        type="button"
        onClick={handleCreatePoll}
        className="bg-purple-600 text-white rounded-full px-12 py-3 text-lg font-semibold shadow-md cursor-pointer"
      >
        Ask Question
      </button>
    </div>
  </div>
</div>

  );
};

export default PollCreator;
