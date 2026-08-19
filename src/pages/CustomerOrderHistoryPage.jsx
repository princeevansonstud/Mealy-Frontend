import React, { useState, useEffect } from 'react';

export default function CustomerOrderHistoryPage({ orders = [], onUpdateOrderStatus }) {
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [timerWasStarted, setTimerWasStarted] = useState(false);

    // Filter active vs completed orders
    const activeOrders = orders.filter((o) => !o.isCompleted);
    const pastOrders = orders.filter((o) => o.isCompleted);

    const latestActiveOrder = activeOrders.length > 0 ? activeOrders[activeOrders.length - 1] : null;

    useEffect(() => {
        if (!latestActiveOrder) {
            setTimeRemaining(0);
            setTimerWasStarted(false);
            return;
        }

        const COOK_TIME_SECONDS = 300; // 5 minute countdown
        const orderTimestamp = new Date(latestActiveOrder.timestamp).getTime();

        const updateTimer = () => {
            const now = Date.now();
            const elapsed = Math.floor((now - orderTimestamp) / 1000);
            const remaining = Math.max(0, COOK_TIME_SECONDS - elapsed);

            if (remaining > 0) {
                setTimerWasStarted(true);
            }

            setTimeRemaining(remaining);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [latestActiveOrder]);

    const formatTime = (seconds) => {
        if (seconds <= 0) return '00 : 00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins} Min : ${secs < 10 ? '0' : ''}${secs} Sec`;
    };

    const handleFeedback = (responseMsg) => {
        setFeedback(responseMsg);
        setTimerWasStarted(false);
        if (latestActiveOrder && onUpdateOrderStatus) {
            onUpdateOrderStatus(latestActiveOrder.id, {
                isCompleted: true,
                completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        }
    };

    const currentReceiptItems = latestActiveOrder
        ? latestActiveOrder.items
        : orders.length > 0
            ? orders[orders.length - 1].items
            : [];

    // Calculate total including individual item quantities
    const totalAmount = currentReceiptItems.reduce(
        (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
        0
    );

    const showArrivalPrompt = timerWasStarted && timeRemaining === 0 && latestActiveOrder;

    return (
        <div className="w-full max-w-5xl mx-auto py-6 space-y-8">
            <h1 className="text-2xl font-black text-center uppercase tracking-wide">My Orders</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Left Side: Current & Past Orders */}
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
                                // Unroll quantity so multiple copies render distinct cards
                                activeOrders
                                    .flatMap((order) =>
                                        order.items.flatMap((item) =>
                                            Array.from({ length: item.quantity || 1 }, () => item)
                                        )
                                    )
                                    .map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex flex-col"
                                        >
                                            <div className="w-full h-28 bg-gray-200 flex items-center justify-center border-b border-gray-200">
                                                <span className="text-gray-400 font-bold uppercase text-[10px]">IMAGE</span>
                                            </div>
                                            <div className="p-2 border-b border-gray-100 flex justify-between items-center text-[10px] font-extrabold">
                                                <span>{item.name || item.title}</span>
                                                <span>KSH {item.price}</span>
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
                                            {order.items
                                                .flatMap((item) =>
                                                    Array.from({ length: item.quantity || 1 }, () => item)
                                                )
                                                .map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-white border border-gray-300 rounded shadow-xs overflow-hidden flex flex-col"
                                                    >
                                                        <div className="w-full h-24 bg-gray-200 flex items-center justify-center border-b border-gray-200">
                                                            <span className="text-gray-400 font-bold uppercase text-[10px]">
                                                                IMAGE
                                                            </span>
                                                        </div>
                                                        <div className="p-2 border-b border-gray-100 flex justify-between items-center text-[10px] font-extrabold text-gray-600">
                                                            <span>{item.name || item.title}</span>
                                                            <span>KSH {item.price}</span>
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

                {/* Right Side: Processing Receipt & Timer */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm min-h-[260px] flex flex-col">
                        <h2 className="text-center font-bold text-base mb-2">Processing Your Order</h2>
                        <hr className="border-black mb-4" />

                        <div className="flex justify-between font-extrabold text-xs mb-3">
                            <span>Price (KSH):</span>
                            <span>Food Name:</span>
                        </div>

                        <div className="flex-1 space-y-2 overflow-y-auto max-h-36 pr-1">
                            {currentReceiptItems.length > 0 ? (
                                currentReceiptItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-xs font-semibold">
                                        <span>{item.price * (item.quantity || 1)}</span>
                                        <span>
                                            {item.name || item.title} {item.quantity > 1 ? `(x${item.quantity})` : ''}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400">No active process</p>
                            )}
                        </div>

                        <div className="flex justify-between font-extrabold text-sm pt-4 border-t border-gray-200 mt-auto">
                            <span>Total Amount :</span>
                            <span>KSH {totalAmount}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                        <h2 className="font-bold text-sm mb-4">Time Remaining</h2>
                        <p className="text-3xl font-black mb-2">{formatTime(timeRemaining)}</p>
                        <p className="text-[11px] font-extrabold tracking-wide text-gray-700">
                            {timeRemaining > 0 ? 'Your Munchies Are On Their Way!' : 'Order Process Completed'}
                        </p>
                    </div>

                    {showArrivalPrompt && (
                        <div className="bg-white rounded-lg p-6 shadow-md text-center border-2 border-[#FF7A38]">
                            <h2 className="font-extrabold text-sm mb-4">Has Your Meal Arrived ?</h2>

                            {feedback ? (
                                <p className="font-extrabold text-xs text-black">{feedback}</p>
                            ) : (
                                <div className="flex justify-center gap-6">
                                    <button
                                        onClick={() =>
                                            handleFeedback(
                                                'sorry, for the delay. Please wait as we assess you delivery'
                                            )
                                        }
                                        className="bg-red-600 text-white font-extrabold text-xs px-6 py-2 rounded uppercase"
                                    >
                                        No
                                    </button>
                                    <button
                                        onClick={() => handleFeedback('Enjoy your meal')}
                                        className="bg-green-500 text-white font-extrabold text-xs px-6 py-2 rounded uppercase"
                                    >
                                        Yes
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}