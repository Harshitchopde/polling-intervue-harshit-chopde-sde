import React from "react";

const ParticipantPanel = ({ students, socket }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      padding: "20px",
    }}
  >
    <h3 style={{ marginBottom: "16px" }}>Participants</h3>
    {students.length === 0 ? (
      <p>No students online</p>
    ) : (
      <table style={{ width: "100%", fontSize: "14px" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
            <th>Name</th>
            <th style={{ textAlign: "right" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
              <td style={{ padding: "8px 0" }}>{s.name}</td>
              <td style={{ textAlign: "right" }}>
                <button
                  onClick={() => socket?.emit("kick-student", s.id)}
                  style={{
                    color: "#e53935",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  Kick out
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default ParticipantPanel;
