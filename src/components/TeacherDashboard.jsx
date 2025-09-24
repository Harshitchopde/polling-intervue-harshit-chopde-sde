import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SocketService from "../utils/socket";
import PollCreator from "./teacher/PollCreator";
import PollLiveView from "./teacher/PollLiveView";
import PollHistory from "./teacher/PollHistory";
import ParticipantPanel from "./teacher/ParticipantPanel";

const TeacherDashboard = () => {
  const { currentPoll, pollResults, students } = useSelector(
    (state) => state.poll
  );
  const [view, setView] = useState("create"); // "create" | "live" | "history"
  const socket = SocketService.getInstance().getSocket();

  useEffect(() => {
    socket?.emit("join-as-teacher");
  }, [socket]);

  return (
    <div
     className=" min-h-[100vh] bg-[#fff] flex flex-row p-[30px]"
 
    >
      {/* Main Section */}
      <div className=" flex-3 pr-[20px]">
        <div  className="">
          <button
            onClick={() => setView("create")}
            style={tabStyle(view === "create")}
          >
            Create Poll
          </button>
          <button
            onClick={() => setView("live")}
            style={tabStyle(view === "live")}
          >
            Live Poll
          </button>
          <button
            onClick={() => setView("history")}
            style={tabStyle(view === "history")}
          >
            Poll History
          </button>
        </div>

        {view === "create" && <PollCreator socket={socket} />}
        {view === "live" && (
          <PollLiveView poll={currentPoll} socket={socket} />
        )}
        {view === "history" && <PollHistory results={pollResults} />}
      </div>

      {/* Right Sidebar */}
      <div style={{ flex: 1 }}>
        <ParticipantPanel students={students} socket={socket} />
      </div>
    </div>
  );
};

const tabStyle = (active) => ({
  marginRight: "10px",
  padding: "10px 20px",
  borderRadius: "20px",
  border: "1px solid #ccc",
  background: active ? "#805AFD" : "#f5f5f5",
  color: active ? "#fff" : "#333",
  cursor: "pointer",
  fontWeight: 600,
});

export default TeacherDashboard;
