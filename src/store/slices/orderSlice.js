import { createSlice } from '@reduxjs/toolkit';

// Helper to load existing orders from localStorage on app startup
const loadSavedOrders = () => {
    try {
        const saved = localStorage.getItem('mealy_orders');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Could not load orders from localStorage:', e);
        return [];
    }
};

// Helper to safely write back to localStorage
const saveOrders = (orders) => {
    try {
        localStorage.setItem('mealy_orders', JSON.stringify(orders));
    } catch (e) {
        console.error('Could not save orders to localStorage:', e);
    }
};

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        ordersList: loadSavedOrders(),
    },
    reducers: {
        addOrder: (state, action) => {
            const newOrder = {
                id: Date.now(),
                status: 'Pending',
                createdAt: new Date().toISOString(),
                ...action.payload,
            };
            state.ordersList.unshift(newOrder);
            saveOrders(state.ordersList);
        },
        updateOrderStatus: (state, action) => {
            const { orderId, status } = action.payload;
            const order = state.ordersList.find((o) => String(o.id) === String(orderId));
            if (order) {
                order.status = status;
                saveOrders(state.ordersList);
            }
        },
        deleteOrder: (state, action) => {
            const orderId = action.payload;
            state.ordersList = state.ordersList.filter((order) => String(order.id) !== String(orderId));
            saveOrders(state.ordersList);
        },
    },
});

export const { addOrder, updateOrderStatus, deleteOrder } = orderSlice.actions;
export default orderSlice.reducer;