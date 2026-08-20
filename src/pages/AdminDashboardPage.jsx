import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TabNavigation from "../components/layout/TabNavigation";
import ManageMealsTab from "../components/admin/ManageMealsTab";
import SetupMenuTab from "../components/admin/SetupMenuTab";
import ManageOrdersTab from "../components/admin/ManageOrdersTab";
import RevenueTab from "../components/admin/RevenueTab";

export default function AdminDashboardPage() {
    const currentTab = useSelector((state) => state.activeTab?.currentTab || 'manage-meals');

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
            <TabNavigation userRole="admin" />

            <div className="mt-6">
                {renderTabContent()}
            </div>
        </div>
    );
}