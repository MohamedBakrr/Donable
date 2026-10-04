import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: { user: null },
    reducers: {
        signedIn: (state, action) => {
            state.user = action.payload;
        },
        signedOut: (state) => {
            state.user = null;
        },
        updateProfile: (state, action) => {
            if (state.user) state.user = { ...state.user, ...action.payload };
        },
    },
});

export const { hydrate, signedIn, signedOut, updateProfile } =
    authSlice.actions;
export default authSlice.reducer;
