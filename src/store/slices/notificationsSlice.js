import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
    name: "notifications",
    initialState: { items: [] },
    reducers: {
        pushNotification: (state, action) => {
            state.items.unshift(action.payload);
        },
        markNotificationRead: (state, action) => {
            const item = state.items.find(
                (notification) => notification.id === action.payload,
            );
            if (item) item.read = true;
        },
        markAllNotificationsRead: (state) => {
            state.items.forEach((item) => {
                item.read = true;
            });
        },
        clearNotifications: (state) => {
            state.items = [];
        },
    },
});

export const {
    pushNotification,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
