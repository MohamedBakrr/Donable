import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { notificationService } from "../services/notificationService";
import { pushNotification } from "./slices/notificationsSlice";
import { toggleHabitToday } from "./slices/habitsSlice";
import { moveTask, setTaskStatus, updateTask } from "./slices/tasksSlice";

export const listenerMiddleware = createListenerMiddleware();

const announce = (notification, listenerApi) => {
    listenerApi.dispatch(pushNotification(notification));
    if (listenerApi.getState().settings.browserNotificationsEnabled) {
        notificationService.sendBrowserNotification(notification);
    }
};

listenerMiddleware.startListening({
    matcher: isAnyOf(setTaskStatus, updateTask, moveTask),
    effect: (action, listenerApi) => {
        const taskId = moveTask.match(action)
            ? action.payload.taskId
            : action.payload.id;
        const before = listenerApi
            .getOriginalState()
            .tasks.items.find((task) => task.id === taskId);
        const after = listenerApi
            .getState()
            .tasks.items.find((task) => task.id === taskId);
        if (before && after?.status === "DONE" && before.status !== "DONE") {
            announce(
                notificationService.create(
                    "SYSTEM",
                    "Task completed",
                    `You completed “${after.title}”. Nice work.`,
                ),
                listenerApi,
            );
        }
    },
});

listenerMiddleware.startListening({
    actionCreator: toggleHabitToday,
    effect: (action, listenerApi) => {
        const today = new Date().toISOString().slice(0, 10);
        const before = listenerApi
            .getOriginalState()
            .habits.items.find((habit) => habit.id === action.payload);
        const after = listenerApi
            .getState()
            .habits.items.find((habit) => habit.id === action.payload);
        if (
            before &&
            after?.completedDates.includes(today) &&
            !before.completedDates.includes(today)
        ) {
            announce(
                notificationService.create(
                    "SYSTEM",
                    "Habit completed",
                    `You showed up for “${after.name}” today.`,
                ),
                listenerApi,
            );
        }
    },
});
