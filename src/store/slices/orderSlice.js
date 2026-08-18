import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: [
        {
            id: 1,
            customer: 'Mercy',
            meal: 'Beef with Rice',
            price: 450,
            status: 'Confirmed',
            date: '2026-08-18',
        },
        {
            id: 2,
            customer: 'Brian',
            meal: 'Chicken with Fries',
            price: 500,
            status: 'Confirmed',
            date: '2026-08-18',
        },
        {
            id: 3,
            customer: 'Jane',
            meal: 'Beef with Fries',
            price: 400,
            status: 'Pending',
            date: '2026-08-18',
        },
        {
            id: 4,
            customer: 'Kevin',
            meal: 'Chicken with Rice',
            price: 550,
            status: 'Completed',
            date: '2026-08-17',
        },
    ],
    loading: false,
    error: null,
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        addOrder: (state, action) => {
            state.orders.push(action.payload);
        },

        updateOrderStatus: (state, action) => {
            const { id, status } = action.payload;

            const order = state.orders.find(
                (item) => item.id === id
            );

            if (order) {
                order.status = status;
            }
        },

        removeOrder: (state, action) => {
            state.orders = state.orders.filter(
                (order) => order.id !== action.payload
            );
        },
    },
});

export const {
    addOrder,
    updateOrderStatus,
    removeOrder,
} = orderSlice.actions;

export default orderSlice.reducer;