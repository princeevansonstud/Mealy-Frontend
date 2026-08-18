import React from "react";
import { useSelector } from "react-redux";
import TabNavigation from "../components/layout/TabNavigation";
import ManageMealsTab from "../components/admin/ManageMealsTab";
import SetupMenuTab from "../components/admin/SetupMenuTab";
import ManageOrdersTab from "../components/admin/ManageOrdersTab";
import RevenueTab from "../components/admin/RevenueTab";

export default function AdminDashboard() {
    const currentTab = useSelector((state) => state.activeTab.currentTab);

    const renderTabContent = () => {
        switch (currentTab) {
            case 'manage-meals':
                return <ManageMealsTab />;
            case 'setup-menu':
                return <SetupMenuTab />;
            case 'manage-orders':
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