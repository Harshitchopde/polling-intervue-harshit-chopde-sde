import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState= {
  currentPoll: null,
  pollResults: [],
  students: [],
  isConnected: false,
  userType: null,
  studentName: localStorage.getItem('studentName'),
  studentId: localStorage.getItem('studentId'),
  timeRemaining: 0,
  hasAnswered: false,
  isResultsVisible: false,
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    setStudentInfo: (state, action) => {
      state.studentName = action.payload.name;
      state.studentId = action.payload.id;
      localStorage.setItem('studentName', action.payload.name);
      localStorage.setItem('studentId', action.payload.id);
    },
    setCurrentPoll: (state, action) => {
      state.currentPoll = action.payload;
      state.hasAnswered = false;
      state.isResultsVisible = false;
      if (action.payload) {
        state.timeRemaining = action.payload.maxTime;
      }
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    setHasAnswered: (state, action) => {
      state.hasAnswered = action.payload;
    },
    setResultsVisible: (state, action) => {
      state.isResultsVisible = action.payload;
    },
    updatePollResults: (state, action) => {
      state.pollResults = action.payload;
    },
    addPollResult: (state, action) => {
      const existingIndex = state.pollResults.findIndex(r => r.pollId === action.payload.pollId);
      if (existingIndex >= 0) {
        state.pollResults[existingIndex] = action.payload;
      } else {
        state.pollResults.push(action.payload);
      }
    },
    updateStudents: (state, action) => {
      state.students = action.payload;
    },
    resetPoll: (state) => {
      state.currentPoll = null;
      state.hasAnswered = false;
      state.isResultsVisible = false;
      state.timeRemaining = 0;
    },
  },
});

export const {
  setConnected,
  setUserType,
  setStudentInfo,
  setCurrentPoll,
  setTimeRemaining,
  setHasAnswered,
  setResultsVisible,
  updatePollResults,
  addPollResult,
  updateStudents,
  resetPoll,
} = pollSlice.actions;

export default pollSlice.reducer;