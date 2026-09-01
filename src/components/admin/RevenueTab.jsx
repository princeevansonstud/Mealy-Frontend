import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function RevenueAnalytics() {

    const reduxOrders = useSelector((state) => state.orders?.ordersList || []);

    const stats = useMemo(() => {

        const validOrders = reduxOrders.filter((o) => o.status !== 'Cancelled');

        let revenue = 0;
        let mealsCount = 0;

        validOrders.forEach((order) => {
            (order.items || []).forEach((item) => {
                const qty = item.quantity || 1;
                const price = Number(item.price || 0);

                revenue += price * qty;
                mealsCount += qty;
            });
        });

        return {
            totalRevenue: revenue,
            totalMealsSold: mealsCount,
            totalOrders: validOrders.length,
            averageOrderValue: validOrders.length > 0 ? revenue / validOrders.length : 0,
        };
    }, [reduxOrders]);

    return (
        <div className="p-6 space-y-6 bg-white rounded-lg shadow-xs">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-3">
                Revenue Analytics
            </h2>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Total Revenue
                    </p>
                    <p className="text-2xl font-black text-[#FF7A38] mt-1">
                        KSH {stats.totalRevenue.toLocaleString()}
                    </p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Total Meals Sold
                    </p>
                    <p className="text-2xl font-black text-gray-800 mt-1">
                        {stats.totalMealsSold}
                    </p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Avg Order Value
                    </p>
                    <p className="text-2xl font-black text-gray-800 mt-1">
                        KSH {Math.round(stats.averageOrderValue).toLocaleString()}
                    </p>
                </div>
            </div>


            <div className="mt-8">
                <h3 className="text-sm font-bold uppercase text-gray-600 mb-3">
                    Completed Transactions ({stats.totalOrders})
                </h3>
                <table className="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr className="border-b bg-gray-100 text-gray-700 font-bold uppercase">
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Items</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reduxOrders
                            .filter((o) => o.status !== 'Cancelled')
                            .map((order) => {
                                const orderTotal = (order.items || []).reduce(
                                    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
                                    0
                                );
                                return (
                                    <tr key={order.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-semibold">#{order.id}</td>
                                        <td className="p-3">
                                            {(order.items || [])
                                                .map((i) => `${i.quantity || 1}x ${i.name || i.title}`)
                                                .join(', ')}
                                        </td>
                                        <td className="p-3 font-bold text-green-600">
                                            {order.status || 'Delivered'}
                                        </td>
                                        <td className="p-3 text-right font-bold">
                                            KSH {orderTotal.toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}