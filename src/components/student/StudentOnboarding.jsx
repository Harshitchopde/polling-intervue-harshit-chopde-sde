import React, { useState } from "react";

const StudentOnboarding = ({ onContinue }) => {
  const [nameInput, setNameInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    onContinue(nameInput.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-lg text-center">
        {/* Badge */}
        <div className="mb-6">
          <span className="bg-[#805AFD] text-white px-4 py-1 rounded-full text-sm font-semibold">
            Intervue Poll
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-normal mb-2 text-black">
          Let’s <span className="font-bold">Get Started</span>
        </h2>
        <p className="text-[#757575] text-base mb-8 leading-relaxed">
          If you're a student, you'll be able to{" "}
          <span className="font-bold">submit your answers</span>, participate
          in live polls, and see how your responses compare with your classmates
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-6 text-left">
          <label className="font-semibold text-base mb-2 block text-black">
            Enter your Name
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="w-full px-4 py-3 text-base rounded-md mb-8 bg-[#f2f2f2] text-gray-800 placeholder-gray-400 focus:outline-none"
            placeholder="Your name..."
            required
          />
          <div className="text-center">
            <button
              type="submit"
              disabled={!nameInput.trim()}
              className={`px-12 py-3 rounded-full text-lg font-semibold shadow-md transition ${
                nameInput.trim()
                  ? "bg-[#805AFD] text-white cursor-pointer"
                  : "bg-[#d3c9f9] text-white cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentOnboarding;
