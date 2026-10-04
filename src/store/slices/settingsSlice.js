import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        theme: "system",
        focusMinutes: 25,
        breakMinutes: 5,
        soundEnabled: true,
        browserNotificationsEnabled: false,
    },
    reducers: {
        updateSettings: (state, action) => {
            Object.assign(state, action.payload);
        },
    },
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
