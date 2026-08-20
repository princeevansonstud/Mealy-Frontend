import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        message: null,
        hasUnreadMenuNotification: false,
    },
    reducers: {
        setMenuNotification: (state, action) => {
            state.message = action.payload;
            state.hasUnreadMenuNotification = true;
        },
        clearNotification: (state) => {
            state.message = null;
            state.hasUnreadMenuNotification = false;
        },
    },
});

export const { setMenuNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;