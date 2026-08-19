import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateOrderStatus, deleteOrder } from '../../store/slices/orderSlice';

export default function ManageOrdersTab() {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.orders?.ordersList || []);

    const handleDelete = (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            dispatch(deleteOrder(orderId));
        }
    };

    return (
        <div className="bg-white p-6 shadow-sm rounded">
            <h2 className="text-xl font-black mb-4">Customer Orders</h2>

            {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p>No confirmed customer orders yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="border p-4 rounded-md bg-gray-50 flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <span className="font-black text-sm uppercase">Order #{order.id}</span>
                                    <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded font-bold text-gray-600">
                                        {order.timestamp}
                                    </span>
                                </div>
                                <p className="text-xs font-bold text-gray-800">
                                    Customer: {order.customerName} ({order.phone})
                                </p>
                                {order.deliveryAddress && (
                                    <p className="text-xs text-gray-500">Address: {order.deliveryAddress}</p>
                                )}

                                <div className="pt-2">
                                    <p className="text-[11px] font-bold text-gray-600 uppercase">Items Ordered:</p>
                                    <ul className="list-disc list-inside text-xs text-gray-700">
                                        {order.items?.map((item, idx) => (
                                            <li key={idx}>
                                                {item.title || item.name} ({item.quantity || 1}) - KSH {item.price}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="flex flex-col justify-between items-end border-t md:border-t-0 pt-3 md:pt-0 gap-3">
                                <span className="font-extrabold text-sm text-[#FF7A38]">
                                    Total: KSH {order.totalAmount}
                                </span>

                                <div className="flex items-center gap-2">
                                    <label className="text-xs font-bold text-gray-500">Status:</label>
                                    <select
                                        value={order.status}
                                        onChange={(e) =>
                                            dispatch(
                                                updateOrderStatus({
                                                    orderId: order.id,
                                                    status: e.target.value,
                                                })
                                            )
                                        }
                                        className="border text-xs font-bold p-1 bg-white rounded focus:outline-none"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Preparing">Preparing</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>

                                   
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(order.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold px-3 py-1 rounded transition-colors uppercase ml-2"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}