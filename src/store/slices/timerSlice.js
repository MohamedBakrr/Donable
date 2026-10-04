import { createSlice } from "@reduxjs/toolkit";

const defaultTimer = {
    status: "idle",
    remainingSeconds: 25 * 60,
    sessionType: "focus",
    taskId: "",
};
const timerSlice = createSlice({
    name: "timer",
    initialState: defaultTimer,
    reducers: {
        startTimer: (state, action) => {
            state.status = "running";
            state.remainingSeconds = action.payload.seconds;
            state.sessionType = action.payload.sessionType || "focus";
            state.taskId = action.payload.taskId || "";
        },
        pauseTimer: (state) => {
            state.status = "paused";
        },
        resumeTimer: (state) => {
            state.status = "running";
        },
        tickTimer: (state) => {
            if (state.status === "running" && state.remainingSeconds > 0)
                state.remainingSeconds -= 1;
        },
        resetTimer: (state, action) =>
            Object.assign(state, {
                ...defaultTimer,
                remainingSeconds:
                    action.payload || defaultTimer.remainingSeconds,
            }),
    },
});

export const { startTimer, pauseTimer, resumeTimer, tickTimer, resetTimer } =
    timerSlice.actions;
export default timerSlice.reducer;
