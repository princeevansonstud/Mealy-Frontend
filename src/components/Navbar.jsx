import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../store/slices/activeTabSlice';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const currentTab = useSelector((state) => state.activeTab.currentTab);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const cartItems = useSelector((state) => state.cart?.items || []);

    const userRole = user?.role || 'customer';

    // Handle logout action
    const handleLogout = () => {
        localStorage.removeItem('mealyAccessToken');
        localStorage.removeItem('mealyRefreshToken');
        localStorage.removeItem('mealyCurrentUser');
        dispatch(logout());
        dispatch(setActiveTab('login'));
    };

    // Customer navigation items when logged in
    const customerNavItems = [
        { label: 'MUNCHIES', key: 'munchies' },
        { label: `FOODCART (${cartItems.length})`, key: 'foodcart' },
        { label: 'MY ORDERS', key: 'my-orders' },
    ];

    // Admin / Caterer navigation items when logged in
    const adminNavItems = [
        { label: 'MEAL OPTIONS', key: 'manage-meals' },
        { label: 'SET MENU', key: 'setup-menu' },
        { label: 'CUSTOMER ORDERS', key: 'manage-orders' },
        { label: 'REVENUE', key: 'revenue' },
    ];

    // Guest navigation items when logged out
    const guestNavItems = [
        { label: 'SIGNUP', key: 'signup' },
        { label: 'LOGIN', key: 'login' },
    ];

    // Determine navigation links based on auth status and role
    const getNavItems = () => {
        if (!isAuthenticated) return guestNavItems;
        return userRole === 'caterer' || userRole === 'admin' ? adminNavItems : customerNavItems;
    };

    const navItems = getNavItems();

    return (
        <header className="bg-[#FF7A38] text-white px-8 py-4 flex justify-between items-center shadow-md">
            {/* Logo */}
            <h1
                onClick={() => dispatch(setActiveTab(userRole === 'caterer' || userRole === 'admin' ? 'manage-meals' : 'munchies'))}
                className="text-2xl font-black tracking-wider cursor-pointer"
            >
                MEALY
            </h1>

            {/* Navigation Buttons */}
            <nav className="flex items-center gap-6 font-bold text-xs tracking-wide">
                {navItems.map((item) => {
                    const isActive = currentTab === item.key;
                    return (
                        <button
                            key={item.key}
                            onClick={() => dispatch(setActiveTab(item.key))}
                            className={`hover:text-black transition-colors ${isActive ? 'underline underline-offset-4 text-black' : ''
                                }`}
                        >
                            {item.label}
                        </button>
                    );
                })}

                {/* Display username and logout when authenticated */}
                {isAuthenticated && (
                    <div className="flex items-center gap-4 ml-2">
                        <span className="font-extrabold uppercase text-white">
                            {user?.name || user?.username || user?.email}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-3 py-1 font-bold rounded hover:bg-red-700 transition-colors"
                        >
                            LOGOUT
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;