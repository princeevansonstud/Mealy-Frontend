import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TabNavigation from "../components/layout/TabNavigation";
import ManageMealsTab from "../components/admin/ManageMealsTab";
import SetupMenuTab from "../components/admin/SetupMenuTab";
import ManageOrdersTab from "../components/admin/ManageOrdersTab";
import RevenueTab from "../components/admin/RevenueTab";
import { logout } from '../store/slices/authSlice';
import { setActiveTab } from '../store/slices/activeTabSlice';

export default function AdminDashboardPage() {
    const dispatch = useDispatch();
    const currentTab = useSelector((state) => state.activeTab?.currentTab || 'manage-meals');

    const handleLogout = () => {
        localStorage.removeItem('mealyCurrentUser');
        dispatch(logout());
        dispatch(setActiveTab('login'));
    };

    const renderTabContent = () => {
        switch (currentTab) {
            case 'manage-meals':
                return <ManageMealsTab />;
            case 'setup-menu':
                return <SetupMenuTab />;
            case 'manage-orders':
            case 'caterer-dashboard':
                return <ManageOrdersTab />;
            case 'revenue':
                return <RevenueTab />;
            default:
                return <ManageMealsTab />;
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white shadow-sm p-6 mb-6 flex justify-between items-center border-b border-gray-200">
                <div>
                    <h1 className="text-xl font-black uppercase tracking-wide">
                        Caterer Dashboard
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Manage your meals, set daily menus, and track incoming orders.
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                >
                    Logout
                </button>
            </div>

            <TabNavigation userRole="admin" />

            <div className="mt-6">
                {renderTabContent()}
            </div>
        </div>
    );
}