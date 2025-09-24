import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setStudentInfo, setHasAnswered } from "../store/pollSlice";
import SocketService from "../utils/socket";
import { v4 as uuidv4 } from "uuid";
import StudentOnboarding from "./student/StudentOnboarding";
import QuizQuestion from "./student/QuizQuestion";
import WaitingScreen from "./student/WaitingScreen";
import PollResults from "./student/PollResults";


const StudentDashboard = () => {
  const dispatch = useDispatch();
  const {
    currentPoll,
    studentName,
    studentId,
    timeRemaining,
    hasAnswered,
    isResultsVisible,
    students,
  } = useSelector((state) => state.poll);
  const [showNameForm, setShowNameForm] = useState(!studentName);
  const socket = SocketService.getInstance().getSocket();

  useEffect(() => {
    if (studentName && studentId && socket) {
      socket.emit("join-as-student", { name: studentName, id: studentId });
    }
  }, [studentName, studentId, socket]);

  const handleContinue = (name) => {
    const newStudentId = studentId || uuidv4();
    dispatch(setStudentInfo({ name, id: newStudentId }));
    setShowNameForm(false);
    socket?.emit("join-as-student", { name, id: newStudentId });
  };

  const handleAnswerSubmit = (answer) => {
    if (!currentPoll) return;
    socket?.emit("submit-answer", {
      pollId: currentPoll.id,
      answer,
      studentId,
      studentName,
    });
    dispatch(setHasAnswered(true));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (showNameForm) {
    return <StudentOnboarding onContinue={handleContinue} />;
  }

  return (
    <div
    >
 
      {/* Main Area */}
      <div>
        {!currentPoll? (
          <WaitingScreen />
        ) : !currentPoll.isActive ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 32,
              textAlign: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ fontSize: 22, marginBottom: 12, color: "#333" }}>
              Poll Ended
            </h2>
            <p style={{ color: "#666" }}>
              This poll has ended. Check the results below!
            </p>
          </div>
        ) : hasAnswered || isResultsVisible ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 32,
              textAlign: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              marginBottom: 24,
            }}
          >
            <h2 style={{ fontSize: 22, marginBottom: 12, color: "#008000" }}>
              Answer Submitted!
            </h2>
            <p style={{ color: "#666" }}>
              Thank you for your response. View the live results below.
            </p>
          </div>
        ) : (
          <QuizQuestion
            question={currentPoll.question}
            options={currentPoll.options}
            time={formatTime(timeRemaining)}
            onSubmit={handleAnswerSubmit}
          />
        )}

        {/* Show Results */}
        {(hasAnswered || isResultsVisible || !currentPoll?.isActive) &&
          currentPoll && <PollResults />}
      </div>
    </div>
  );
};

export default StudentDashboard;
