import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../store/slices/activeTabSlice';

const Navbar = ({ userRole = 'customer' }) => {
    const dispatch = useDispatch();
    const currentTab = useSelector((state) => state.activeTab.currentTab);

    // Dynamic tabs based on user role
    const customerNavItems = [
        { label: 'MUNCHIES', key: 'munchies' },
        { label: 'FOODCART', key: 'foodcart' },
        { label: 'SIGNUP', key: 'signup' },
        { label: 'LOGIN', key: 'login' },
    ];

    const adminNavItems = [
        { label: 'MEAL OPTIONS', key: 'manage-meals' },
        { label: 'SET MENU', key: 'setup-menu' },
        { label: 'CUSTOMER ORDERS', key: 'manage-orders' },
        { label: 'REVENUE', key: 'revenue' },
    ];

    const navItems = userRole === 'admin' ? adminNavItems : customerNavItems;

    return (
        <header className="bg-[#FF7A38] text-white px-8 py-4 flex justify-between items-center shadow-md">
            {/* Logo */}
            <h1
                onClick={() => dispatch(setActiveTab(userRole === 'admin' ? 'manage-meals' : 'munchies'))}
                className="text-2xl font-black tracking-wider cursor-pointer"
            >
                MEALY
            </h1>

            {/* Navigation Buttons */}
            <nav className="flex gap-6 font-bold text-xs tracking-wide">
                {navItems.map((item) => {
                    const isActive = currentTab === item.key;
                    return (
                        <button
                            key={item.key}
                            onClick={() => dispatch(setActiveTab(item.key))}
                            className={`hover:text-black transition-colors ${
                                isActive ? 'underline underline-offset-4 text-black' : ''
                            }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </nav>
        </header>
    );
};

export default Navbar;