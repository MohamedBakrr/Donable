import { createSlice } from "@reduxjs/toolkit";

const stamp = () => new Date().toISOString();
const activity = (type, message) => ({
    id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    message,
    createdAt: stamp(),
});

const tasksSlice = createSlice({
    name: "tasks",
    initialState: { items: [], activity: [] },
    reducers: {
        addTask: (state, action) => {
            state.items.unshift({
                ...action.payload,
                id: `task-${Date.now()}`,
                status: action.payload.status || "TODO",
                createdAt: stamp(),
                updatedAt: stamp(),
                completedAt: null,
                actualTime: 0,
                completedSubtasks: [],
                position: 0,
            });
            state.activity.unshift(
                activity(
                    "TASK_CREATED",
                    `Added “${action.payload.title}” to your tasks`,
                ),
            );
        },
        updateTask: (state, action) => {
            const task = state.items.find(
                (item) => item.id === action.payload.id,
            );
            if (!task) return;
            const previousStatus = task.status;
            const completedSubtaskTitles = (task.completedSubtasks || [])
                .map((index) => task.subtasks?.[index])
                .filter(Boolean);
            Object.assign(task, action.payload, { updatedAt: stamp() });
            if (action.payload.subtasks) {
                task.completedSubtasks = task.subtasks
                    .map((title, index) =>
                        completedSubtaskTitles.includes(title) ? index : -1,
                    )
                    .filter((index) => index >= 0);
            }
            if (previousStatus !== task.status) {
                task.completedAt = task.status === "DONE" ? stamp() : null;
                state.activity.unshift(
                    activity(
                        task.status === "DONE"
                            ? "TASK_COMPLETED"
                            : "TASK_MOVED",
                        task.status === "DONE"
                            ? `Completed “${task.title}”`
                            : `Moved “${task.title}” to ${task.status.replace("_", " ").toLowerCase()}`,
                    ),
                );
            } else {
                state.activity.unshift(
                    activity("TASK_UPDATED", `Updated “${task.title}”`),
                );
            }
        },
        setTaskStatus: (state, action) => {
            const task = state.items.find(
                (item) => item.id === action.payload.id,
            );
            if (!task || task.status === action.payload.status) return;
            task.status = action.payload.status;
            task.updatedAt = stamp();
            task.completedAt = task.status === "DONE" ? stamp() : null;
            state.activity.unshift(
                activity(
                    task.status === "DONE" ? "TASK_COMPLETED" : "TASK_MOVED",
                    task.status === "DONE"
                        ? `Completed “${task.title}”`
                        : `Moved “${task.title}” to ${task.status.replace("_", " ").toLowerCase()}`,
                ),
            );
        },
        deleteTask: (state, action) => {
            const task = state.items.find((item) => item.id === action.payload);
            if (task) {
                state.items = state.items.filter(
                    (item) => item.id !== action.payload,
                );
                state.activity.unshift(
                    activity("TASK_DELETED", `Removed “${task.title}”`),
                );
            }
        },
        moveTask: (state, action) => {
            const { taskId, status, beforeId } = action.payload;
            const task = state.items.find((item) => item.id === taskId);
            if (!task) return;
            const previousStatus = task.status;
            const list = state.items.filter(
                (item) => item.status === status && item.id !== taskId,
            );
            const targetIndex = beforeId
                ? list.findIndex((item) => item.id === beforeId)
                : list.length;
            list.splice(targetIndex < 0 ? list.length : targetIndex, 0, {
                ...task,
                status,
                updatedAt: stamp(),
                completedAt: status === "DONE" ? stamp() : null,
            });
            state.items = state.items.filter(
                (item) => item.status !== status && item.id !== taskId,
            );
            state.items.push(...list);
            state.activity.unshift(
                activity(
                    previousStatus !== status && status === "DONE"
                        ? "TASK_COMPLETED"
                        : "TASK_MOVED",
                    previousStatus !== status && status === "DONE"
                        ? `Completed “${task.title}”`
                        : `Moved “${task.title}”`,
                ),
            );
        },
        toggleSubtask: (state, action) => {
            const task = state.items.find(
                (item) => item.id === action.payload.taskId,
            );
            if (!task) return;
            task.completedSubtasks ||= [];
            const {index} = action.payload;
            task.completedSubtasks = task.completedSubtasks.includes(index)
                ? task.completedSubtasks.filter((item) => item !== index)
                : [...task.completedSubtasks, index];
            task.updatedAt = stamp();
        },
        addFocusTime: (state, action) => {
            const task = state.items.find(
                (item) => item.id === action.payload.taskId,
            );
            if (task) {
                task.actualTime =
                    (task.actualTime || 0) + action.payload.minutes;
                task.updatedAt = stamp();
            }
            state.activity.unshift({
                ...activity(
                    "FOCUS_COMPLETED",
                    `Finished a ${action.payload.minutes}-minute focus session${task ? ` on “${task.title}”` : ""}`,
                ),
                minutes: action.payload.minutes,
            });
        },
    },
});

export const {
    addTask,
    updateTask,
    setTaskStatus,
    deleteTask,
    moveTask,
    toggleSubtask,
    addFocusTime,
} = tasksSlice.actions;
export default tasksSlice.reducer;
