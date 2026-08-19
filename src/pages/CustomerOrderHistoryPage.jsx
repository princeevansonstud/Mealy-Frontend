import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateOrderStatus } from '../store/slices/orderSlice';

export default function CustomerOrderHistoryPage() {
    const dispatch = useDispatch();

    // Retrieve orders from Redux store
    const reduxOrders = useSelector((state) => state.orders?.ordersList || []);

    const [timeRemaining, setTimeRemaining] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [timerWasStarted, setTimerWasStarted] = useState(false);

    // Filter active vs completed orders based on status string
    const activeOrders = reduxOrders.filter(
        (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
    );
    const pastOrders = reduxOrders.filter(
        (o) => o.status === 'Delivered' || o.status === 'Cancelled'
    );

    const latestActiveOrder = activeOrders.length > 0 ? activeOrders[0] : null;

    // Safe Primitive Dependency prevents infinite loops
    const latestOrderId = latestActiveOrder?.id;

    useEffect(() => {
        if (!latestActiveOrder) {
            setTimeRemaining(0);
            setTimerWasStarted(false);
            return;
        }

        const COOK_TIME_SECONDS = 300; // 5-minute countdown
        const orderTimestamp = latestActiveOrder.createdAt
            ? new Date(latestActiveOrder.createdAt).getTime()
            : Date.now();

        const updateTimer = () => {
            const now = Date.now();
            const elapsed = Math.floor((now - orderTimestamp) / 1000);
            const remaining = Math.max(0, COOK_TIME_SECONDS - elapsed);

            if (remaining > 0) {
                setTimerWasStarted(true);
                if (latestActiveOrder.status === 'Pending') {
                    dispatch(
                        updateOrderStatus({
                            orderId: latestActiveOrder.id,
                            status: 'Preparing',
                        })
                    );
                }
            }

            setTimeRemaining(remaining);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [latestOrderId, dispatch]);

    const formatTime = (seconds) => {
        if (seconds <= 0) return '00 : 00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins} Min : ${secs < 10 ? '0' : ''}${secs} Sec`;
    };

    const handleFeedback = (responseMsg, isDelivered = true) => {
        setFeedback(responseMsg);
        setTimerWasStarted(false);

        if (latestActiveOrder) {
            dispatch(
                updateOrderStatus({
                    orderId: latestActiveOrder.id,
                    status: isDelivered ? 'Delivered' : 'Cancelled',
                })
            );
        }
    };

    // Normalize active order items to fix line total & grand total calculations
    const currentReceiptItems = (latestActiveOrder?.items || []).map((item) => {
        const qty = Number(item.quantity) || 1;
        const unitPrice = Number(item.unitPrice || item.price) || 0;
        const lineTotal = unitPrice * qty;

        return {
            name: item.name || item.title || 'Food Item',
            quantity: qty,
            unitPrice: unitPrice,
            lineTotal: lineTotal,
        };
    });

    const totalAmount = currentReceiptItems.reduce(
        (sum, item) => sum + item.lineTotal,
        0
    );

    const showArrivalPrompt =
        timerWasStarted && timeRemaining === 0 && latestActiveOrder;

    return (
        <div className="w-full max-w-5xl mx-auto py-6 space-y-8">
            <h1 className="text-2xl font-black text-center uppercase tracking-wide">
                My Orders
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Left Column: Active & Past Orders */}
                <div className="space-y-6">
                    <div>
                        <h2 className="font-extrabold text-sm mb-3 uppercase tracking-wider text-black">
                            Current Orders
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {activeOrders.length === 0 ? (
                                <p className="col-span-2 text-xs text-gray-400 font-bold py-4">
                                    No active orders right now.
                                </p>
                            ) : (
                                activeOrders
                                    .flatMap((order) =>
                                        (order.items || []).flatMap((item) =>
                                            Array.from({ length: item.quantity || 1 }, () => ({
                                                ...item,
                                                orderId: order.id,
                                            }))
                                        )
                                    )
                                    .map((item, idx) => (
                                        <div
                                            key={`${item.orderId}-${idx}`}
                                            className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex flex-col"
                                        >
                                            <div className="w-full h-28 bg-gray-200 flex items-center justify-center border-b border-gray-200">
                                                <span className="text-gray-400 font-bold uppercase text-[10px]">
                                                    IMAGE
                                                </span>
                                            </div>
                                            <div className="p-2 border-b border-gray-100 flex justify-between items-center text-[10px] font-extrabold">
                                                <span>{item.name || item.title}</span>
                                                <span>KSH {item.unitPrice || item.price}</span>
                                            </div>
                                            <div className="bg-[#FF7A38] p-2 min-h-[24px]" />
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>

                    {pastOrders.length > 0 && (
                        <div className="pt-6 border-t-2 border-gray-300">
                            <h2 className="font-extrabold text-sm mb-3 uppercase tracking-wider text-gray-500">
                                Past Orders
                            </h2>
                            <div className="space-y-4">
                                {pastOrders.map((order) => (
                                    <div key={order.id} className="space-y-2">
                                        <p className="text-[11px] font-bold text-gray-500">
                                            Delivered at: {order.completedAt || 'Earlier Today'}
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 filter grayscale opacity-75">
                                            {(order.items || [])
                                                .flatMap((item) =>
                                                    Array.from(
                                                        { length: item.quantity || 1 },
                                                        () => item
                                                    )
                                                )
                                                .map((item, idx) => (
                                                    <div
                                                        key={`${order.id}-${idx}`}
                                                        className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden flex flex-col"
                                                    >
                                                        <div className="w-full h-24 bg-gray-200 flex items-center justify-center border-b border-gray-200">
                                                            <span className="text-gray-400 font-bold uppercase text-[10px]">
                                                                IMAGE
                                                            </span>
                                                        </div>
                                                        <div className="p-2 border-b border-gray-100 flex justify-between items-center text-[10px] font-extrabold text-gray-600">
                                                            <span>{item.name || item.title}</span>
                                                            <span>KSH {item.unitPrice || item.price}</span>
                                                        </div>
                                                        <div className="bg-gray-400 p-2 min-h-[20px]" />
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Timer & Order Status */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm min-h-[260px] flex flex-col">
                        <h2 className="text-center font-bold text-base mb-2">
                            Processing Your Order
                        </h2>
                        <hr className="border-black mb-4" />

                        <div className="flex justify-between font-extrabold text-xs mb-3">
                            <span>Food Name:</span>
                            <span>Price (KSH):</span>
                        </div>

                        <div className="flex-1 space-y-2 overflow-y-auto max-h-36 pr-1">
                            {currentReceiptItems.length > 0 ? (
                                currentReceiptItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between text-xs font-semibold"
                                    >
                                        <span>
                                            {item.quantity > 1 ? `${item.quantity}x ` : ''}
                                            {item.name}
                                        </span>
                                        <span>KSH {item.lineTotal}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 font-bold text-center py-4">
                                    No active receipt.
                                </p>
                            )}
                        </div>

                        <hr className="border-gray-200 my-3" />
                        <div className="flex justify-between font-black text-sm">
                            <span>Total:</span>
                            <span>KSH {totalAmount}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                        <h3 className="font-bold text-sm mb-2">Estimated Prep Time</h3>
                        <div className="text-3xl font-black tracking-wider text-[#FF7A38]">
                            {formatTime(timeRemaining)}
                        </div>

                        {showArrivalPrompt && (
                            <div className="mt-4 space-y-3">
                                <p className="text-xs font-bold text-gray-700">
                                    Has your food arrived?
                                </p>
                                <div className="flex justify-center gap-3">
                                    <button
                                        onClick={() =>
                                            handleFeedback('Order delivered successfully!', true)
                                        }
                                        className="bg-black text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-gray-800"
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleFeedback('Order reported delay.', false)
                                        }
                                        className="bg-gray-200 text-black px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-gray-300"
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        )}

                        {feedback && (
                            <p className="mt-3 text-xs font-bold text-green-600">
                                {feedback}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}