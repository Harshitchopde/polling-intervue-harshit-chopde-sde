import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import SocketService from "./utils/socket";
import StudentOnboarding from "./components/student/StudentOnboarding";
import {
  setConnected,
  setUserType,
  setCurrentPoll,
  setTimeRemaining,
  setResultsVisible,
  addPollResult,
  updateStudents,
  resetPoll,
} from "./store/pollSlice";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";

function App() {
  const dispatch = useDispatch();
  const { userType } = useSelector((state) => state.poll);
  const socketService = SocketService.getInstance();
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    const socket = socketService.connect();

    socket.on("connect", () => {
      dispatch(setConnected(true));
    });

    socket.on("disconnect", () => {
      dispatch(setConnected(false));
    });

    socket.on("poll-created", (poll) => {
      dispatch(setCurrentPoll(poll));
    });

    socket.on("poll-ended", (pollResult) => {
      dispatch(addPollResult(pollResult));
      dispatch(setResultsVisible(true));
      dispatch(resetPoll());
    });

    socket.on("poll-results", (pollResult) => {
      dispatch(addPollResult(pollResult));
    });

    socket.on("students-updated", (students) => {
      dispatch(updateStudents(students));
    });

    socket.on("time-update", (timeRemaining) => {
      dispatch(setTimeRemaining(timeRemaining));
    });

    socket.on("poll-timeout", (pollResult) => {
      dispatch(addPollResult(pollResult));
      dispatch(setResultsVisible(true));
    });

    socket.on("kicked", () => {
      alert("You have been removed from the session by the teacher.");
      localStorage.removeItem("studentName");
      localStorage.removeItem("studentId");
      window.location.reload();
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [dispatch, socketService]);

  const handleContinue = () => {
    if (selectedRole) {
      dispatch(setUserType(selectedRole));
    }
  };

  if (!userType) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white p-6">
        <div className="bg-white   text-center px-8 py-12">
          <div className="mb-5">
            <span className="bg-[#4F0DCE] text-white px-4 py-1 rounded-full text-sm font-semibold">
              Intervue Poll
            </span>
          </div>

          <h2 className="text-2xl font-normal mb-2">
            Welcome to the{" "}
            <span className="font-bold">Live Polling System</span>
          </h2>
          <p className="text-gray-500 mb-7">
            Please select the role that best describes you to begin using the
            live polling system
          </p>

          <div className="flex gap-4 justify-center mb-8">
            <div
              onClick={() => setSelectedRole("student")}
              className={`rounded-md p-6 w-[387px] bg-gray-50 cursor-pointer select-none ${
                selectedRole === "student"
                  ? "border-2  border-[#5767D0]"
                  : "border border-gray-300"
              }`}
            >
              <div className="font-semibold text-lg mb-2">I'm a Student</div>
              <div className="text-xs text-gray-500">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry
              </div>
            </div>

            <div
              onClick={() => setSelectedRole("teacher")}
              className={`rounded-md p-6 w-[387px] bg-gray-50 cursor-pointer select-none ${
                selectedRole === "teacher"
                  ? "border-2 border-[#5767D0]"
                  : "border border-gray-300"
              }`}
            >
              <div className="font-semibold text-lg mb-2">I'm a Teacher</div>
              <div className="text-xs text-gray-500">
                Submit answers and view live poll results in real-time.
              </div>
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`px-12 py-3 rounded-full text-lg font-semibold shadow-sm transition ${
              selectedRole
                ? "bg-[#1D68BD] hover:bg-[#1D68BD] text-white shadow-md"
                : "bg-purple-200 text-white cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (userType === "teacher") {
    return <TeacherDashboard />;
  }

  return <StudentDashboard />;
}

export default App;
