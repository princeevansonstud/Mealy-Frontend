import React from 'react';
import { useSelector } from 'react-redux';

export default function ManageOrdersTab() {
    const orders = useSelector((state) => state.orders.orders);

    const today = new Date().toISOString().split('T')[0];

    const todaysOrders = orders.filter(
        (order) => order.date === today
    );

    const totalOrders = todaysOrders.length;

    const pendingOrders = todaysOrders.filter(
        (order) => order.status === 'Pending'
    ).length;

    const completedOrders = todaysOrders.filter(
        (order) =>
            order.status === 'Completed' ||
            order.status === 'Confirmed'
    ).length;

    return (
        <div className="bg-white min-h-[500px] w-full p-4 md:p-8 shadow-sm rounded-sm">
            <div className="border-b pb-4 mb-6">
                <h1 className="text-xl font-bold text-gray-800">
                    Customer Orders
                </h1>

                <p className="text-xs text-gray-500 mt-1">
                    Orders received for today
                </p>
            </div>

            {/* Order Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 border p-4 rounded">
                    <p className="text-xs text-gray-500 uppercase font-bold">
                        Today's Orders
                    </p>
                    <p className="text-2xl font-black mt-2">
                        {totalOrders}
                    </p>
                </div>

                <div className="bg-gray-50 border p-4 rounded">
                    <p className="text-xs text-gray-500 uppercase font-bold">
                        Pending
                    </p>
                    <p className="text-2xl font-black mt-2">
                        {pendingOrders}
                    </p>
                </div>

                <div className="bg-gray-50 border p-4 rounded">
                    <p className="text-xs text-gray-500 uppercase font-bold">
                        Confirmed / Completed
                    </p>
                    <p className="text-2xl font-black mt-2">
                        {completedOrders}
                    </p>
                </div>
            </div>

            {/* Orders */}
            <div>
                <h2 className="font-bold text-sm uppercase mb-4">
                    Orders
                </h2>

                {todaysOrders.length === 0 ? (
                    <div className="border rounded p-6 text-center text-sm text-gray-500">
                        No orders have been placed today.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {todaysOrders.map((order) => (
                            <div
                                key={order.id}
                                className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                            >
                                <div>
                                    <p className="font-bold text-sm">
                                        {order.customer}
                                    </p>

                                    <p className="text-sm text-gray-600 mt-1">
                                        {order.meal}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
                                        {order.date}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-5">
                                    <p className="font-black text-sm">
                                        KSH {order.price}
                                    </p>

                                    <span
                                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                                            order.status === 'Pending'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : order.status === 'Completed'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-blue-100 text-blue-700'
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}