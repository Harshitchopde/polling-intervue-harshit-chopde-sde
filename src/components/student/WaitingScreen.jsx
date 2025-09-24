import React from "react";

const WaitingScreen = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-white text-black font-inter font-medium text-lg select-none relative">
      {/* Top label */}
      <div className="mb-5">
            <span className="bg-[#4F0DCE] text-white px-4 py-1 rounded-full text-sm font-semibold">
              Intervue Poll
            </span>
          </div>

      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-[#665EFF] border-t-transparent rounded-full animate-spin mb-4"></div>

      {/* Message */}
      <div>Wait for the teacher to ask questions..</div>
    </div>
  );
};

export default WaitingScreen;
