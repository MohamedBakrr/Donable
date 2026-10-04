import { createSlice } from "@reduxjs/toolkit";

const today = () => new Date().toISOString().slice(0, 10);
const habitsSlice = createSlice({
    name: "habits",
    initialState: { items: [] },
    reducers: {
        addHabit: (state, action) => {
            state.items.push({
                ...action.payload,
                id: `habit-${Date.now()}`,
                createdAt: today(),
                completedDates: [],
            });
        },
        toggleHabitToday: (state, action) => {
            const habit = state.items.find(
                (item) => item.id === action.payload,
            );
            if (!habit) return;
            habit.completedDates = habit.completedDates.includes(today())
                ? habit.completedDates.filter((date) => date !== today())
                : [...habit.completedDates, today()];
        },
        deleteHabit: (state, action) => {
            state.items = state.items.filter(
                (item) => item.id !== action.payload,
            );
        },
    },
});

export const { addHabit, toggleHabitToday, deleteHabit } = habitsSlice.actions;
export default habitsSlice.reducer;
