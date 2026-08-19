import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        ordersList: [],
    },
    reducers: {
        addOrder: (state, action) => {
            state.ordersList.unshift({
                id: Date.now(),
                status: 'Pending',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                ...action.payload,
            });
        },
        updateOrderStatus: (state, action) => {
            const { orderId, status } = action.payload;
            const order = state.ordersList.find((o) => o.id === orderId);
            if (order) {
                order.status = status;
            }
        },
        deleteOrder: (state, action) => {
            const orderId = action.payload;
            state.ordersList = state.ordersList.filter((order) => order.id !== orderId);
        },
    },
});

export const { addOrder, updateOrderStatus, deleteOrder } = orderSlice.actions;
export default orderSlice.reducer;