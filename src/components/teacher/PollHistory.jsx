import React from "react";

const PollHistory = ({ results }) => {
  if (!results || results.length === 0) {
    return <p>No past polls available.</p>;
  }
 console.log("POLL history : ",results)
  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>View Poll History</h2>
      {results?.map((poll, idx) => (
        <div
          key={idx}
          style={{
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h4 style={{ marginBottom: "10px" }}>
            Question {idx + 1}: {poll?.question}
          </h4>
          {poll.options?.map((opt, i) => {
            const votes = poll.votes[opt] || 0;
            const percent =
              poll.totalVotes > 0 ? Math.round((votes / poll.totalVotes) * 100) : 0;
            return (
              <div
                key={i}
                style={{
                  marginBottom: "10px",
                  background: "#f9f9f9",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              >
                <div>{opt}</div>
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
        </div>
      ))}
    </div>
  );
};

export default PollHistory;
