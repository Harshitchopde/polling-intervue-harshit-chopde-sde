import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const allowedOrigin = process.env.FRONT_END_URL;

const app = express();
const server = createServer(app);

// ✅ Centralized list of allowed origins
const allowedOrigins = [
  allowedOrigin,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://webcontainer-api.io"
];

// ✅ Reusable CORS check function
const checkOrigin = (origin, callback) => {
  console.log("Origin check:", origin);

  if (!origin) return callback(null, true); // allow curl, mobile apps, etc.

  if (allowedOrigins.some((o) => origin.startsWith(o))) {
    return callback(null, true);
  }

  console.warn("Blocked origin:", origin);
  return callback(null, false); // ❌ don’t throw error (400), just block
};

// ✅ Express CORS middleware
app.use(cors({
  origin: checkOrigin,
  methods: ["GET", "POST"],
  credentials: true,
}));

app.use(express.json());

// ✅ Socket.IO with same CORS config
const io = new Server(server, {
  cors: {
    origin: checkOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// -------------------------
// In-memory storage
// -------------------------
let currentPoll = null;
let students = new Map();
let pollResults = [];
let chatMessages = [];
let pollTimer = null;

// -------------------------
// Helper functions
// -------------------------
const getPollResult = (pollId) => pollResults.find((r) => r.pollId === pollId);

const createPollResult = (poll) => {
  const result = {
    pollId: poll.id,
    question: poll.question,
    options: poll.options,
    votes: {},
    totalVotes: 0,
    responses: [],
    createdAt: poll.createdAt,
  };

  poll.options.forEach((opt) => {
    result.votes[opt] = 0;
  });

  pollResults.push(result);
  return result;
};

const updatePollResult = (pollId, studentId, studentName, answer) => {
  let result = getPollResult(pollId);
  if (!result) return null;

  const existingIndex = result.responses.findIndex((r) => r.studentId === studentId);

  if (existingIndex >= 0) {
    const oldAnswer = result.responses[existingIndex].answer;
    result.votes[oldAnswer]--;
    result.responses[existingIndex] = {
      studentId,
      studentName,
      answer,
      timestamp: Date.now(),
    };
  } else {
    result.responses.push({
      studentId,
      studentName,
      answer,
      timestamp: Date.now(),
    });
  }

  result.votes[answer]++;
  result.totalVotes = result.responses.length;

  return result;
};

const endPoll = () => {
  if (currentPoll) {
    currentPoll.isActive = false;
    currentPoll.endTime = Date.now();

    if (pollTimer) {
      clearTimeout(pollTimer);
      pollTimer = null;
    }

    const result = getPollResult(currentPoll.id);
    if (result) {
      io.emit("poll-ended", result);
    }

    currentPoll = null;
  }
};

const startPollTimer = (poll) => {
  if (pollTimer) {
    clearTimeout(pollTimer);
  }

  const startTime = Date.now();
  const endTime = startTime + poll.maxTime * 1000;

  const timeInterval = setInterval(() => {
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
    io.emit("time-update", remaining);

    if (remaining <= 0) {
      clearInterval(timeInterval);
      const result = getPollResult(poll.id);
      if (result) io.emit("poll-timeout", result);
      endPoll();
    }
  }, 1000);

  pollTimer = setTimeout(() => {
    clearInterval(timeInterval);
    const result = getPollResult(poll.id);
    if (result) io.emit("poll-timeout", result);
    endPoll();
  }, poll.maxTime * 1000);
};

// -------------------------
// Socket.IO events
// -------------------------
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.emit("chat-history", chatMessages);

  socket.on("join-as-teacher", () => {
    socket.join("teachers");
    socket.userType = "teacher";
    console.log("Teacher joined:", socket.id);

    if (currentPoll) socket.emit("poll-created", currentPoll);
    socket.emit("students-updated", Array.from(students.values()));
    socket.emit("poll-results", pollResults);
  });

  socket.on("join-as-student", ({ name, id }) => {
    socket.join("students");
    socket.userType = "student";
    socket.studentId = id;
    socket.studentName = name;

    students.set(id, {
      id,
      name,
      isOnline: true,
      joinedAt: Date.now(),
      socketId: socket.id,
    });

    console.log("Student joined:", name, id);

    if (currentPoll) {
      socket.emit("poll-created", currentPoll);

      if (currentPoll.isActive && currentPoll.startTime) {
        const elapsed = Date.now() - currentPoll.startTime;
        const remaining = Math.max(
          0,
          Math.floor((currentPoll.maxTime * 1000 - elapsed) / 1000)
        );
        socket.emit("time-update", remaining);
      }
    }

    io.emit("students-updated", Array.from(students.values()));

    if (pollResults.length > 0) {
      socket.emit("poll-results", pollResults);
    }
  });

  socket.on("create-poll", (pollData) => {
    if (socket.userType !== "teacher") return;

    const poll = {
      id: uuidv4(),
      question: pollData.question,
      options: pollData.options,
      maxTime: pollData.maxTime,
      isActive: true,
      createdAt: Date.now(),
      startTime: Date.now(),
    };

    currentPoll = poll;
    createPollResult(poll);
    startPollTimer(poll);

    io.emit("poll-created", poll);
    console.log("Poll created:", poll.question);
  });

  socket.on("submit-answer", ({ pollId, answer, studentId, studentName }) => {
    if (socket.userType !== "student") return;
    if (!currentPoll || currentPoll.id !== pollId || !currentPoll.isActive) return;

    const result = updatePollResult(pollId, studentId, studentName, answer);
    if (result) {
      io.emit("poll-results", result);

      console.log("Answer submitted:", studentName, "->", answer);

      const totalStudents = students.size;
      const totalResponses = result.responses.length;

      if (totalResponses >= totalStudents && totalStudents > 0) {
        setTimeout(() => endPoll(), 1000);
      }
    }
  });

  socket.on("end-poll", () => {
    if (socket.userType === "teacher") endPoll();
  });

  socket.on("kick-student", (studentId) => {
    if (socket.userType !== "teacher") return;

    const student = students.get(studentId);
    if (student) {
      const studentSocket = io.sockets.sockets.get(student.socketId);
      if (studentSocket) {
        studentSocket.emit("kicked");
        studentSocket.disconnect();
      }

      students.delete(studentId);
      io.emit("students-updated", Array.from(students.values()));
      console.log("Student kicked:", student.name);
    }
  });

  socket.on("send-message", ({ message, sender, senderType }) => {
    const chatMessage = {
      id: uuidv4(),
      sender,
      senderType,
      message,
      timestamp: Date.now(),
    };

    chatMessages.push(chatMessage);
    if (chatMessages.length > 100) {
      chatMessages = chatMessages.slice(-100);
    }

    io.emit("message-received", chatMessage);
    console.log("Message sent:", sender, "->", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    if (socket.userType === "student" && socket.studentId) {
      students.delete(socket.studentId);
      io.emit("students-updated", Array.from(students.values()));
    }
  });
});

// -------------------------
// REST endpoints
// -------------------------
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/api/poll/status", (req, res) => {
  res.json({
    currentPoll,
    studentsCount: students.size,
    resultsCount: pollResults.length,
  });
});

// -------------------------
// Start server
// -------------------------
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
