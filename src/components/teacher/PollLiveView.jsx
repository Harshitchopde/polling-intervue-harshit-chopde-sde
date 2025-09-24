import React from "react";

const PollLiveView = ({ poll, socket }) => {
  if (!poll) {
    return <p>No active poll</p>;
  }
  
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        padding: "30px",
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>{poll.question}</h3>
      {poll.options.map((opt, idx) => {
        const percent = poll.votes
          ? Math.round(
              ((poll.votes[opt] || 0) / poll.totalVotes) * 100 || 0
            )
          : 0;
        return (
          <div
            key={idx}
            style={{
              marginBottom: "12px",
              padding: "12px",
              borderRadius: "8px",
              background: "#f9f9f9",
            }}
          >
            <div style={{ marginBottom: "6px" }}>{opt}</div>
            <div
              style={{
                background: "#eee",
                borderRadius: "6px",
                height: "16px",
                position: "relative",
              }}
            >
              <div
                style={{
                  background: "#805AFD",
                  height: "16px",
                  width: `${percent}%`,
                  borderRadius: "6px",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "-2px",
                  fontSize: "12px",
                }}
              >
                {percent}%
              </span>
            </div>
          </div>
        );
      })}
      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button
          onClick={() => socket?.emit("end-poll")}
          style={{
            background: "#e53935",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "20px",
            cursor: "pointer",
          }}
        >
          End Poll
        </button>
      </div>
    </div>
  );
};

export default PollLiveView;
