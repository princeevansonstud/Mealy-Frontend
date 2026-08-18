import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '../../store/slices/activeTabSlice';

export default function TabNavigation({ userRole = 'admin' }) {
    const dispatch = useDispatch();
    const currentTab = useSelector((state) => state.activeTab.currentTab);

    const customerTabs = [
        { id: 'daily-menu', label: "Today's Menu" },
        { id: 'order-history', label: 'My Orders' },
    ];

    const adminTabs = [
        { id: 'manage-meals', label: 'Meal Options' },
        { id: 'setup-menu', label: 'Set Menu' },
        { id: 'manage-orders', label: 'Customer Orders' },
        { id: 'revenue', label: 'Revenue' },
    ];

    const tabsToRender = userRole === 'admin' ? adminTabs : customerTabs;

    return (
        <div className="bg-white border-b border-gray-200 px-12">
            <nav className="flex gap-6">
                {tabsToRender.map((tab) => {
                    const isActive = currentTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => dispatch(setActiveTab(tab.id))}
                            className={`py-4 px-2 font-bold text-xs tracking-wider transition-colors border-b-2 uppercase ${
                                isActive
                                    ? 'border-[#FF7A38] text-[#FF7A38]'
                                    : 'border-transparent text-gray-500 hover:text-black'
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}