import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from './store/slices/activeTabSlice';
import { restoreSession, logout } from './store/slices/authSlice';
import { setCategory, setSearchQuery } from './store/slices/menuSlice';
import { updateOrderStatus, deleteOrder } from './store/slices/orderSlice';
import { getCurrentUser, refreshAccessToken } from './api/auth';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CustomerMenuPage from './pages/CustomerMenuPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CheckoutPage from './pages/CheckoutPage';
import CustomerOrderHistoryPage from './pages/CustomerOrderHistoryPage';

function SubHeader({ activeCategory, onSelectCategory, searchQuery, setSearchQuery }) {
    const categories = ['ALL', 'VEGAN', 'BEEF', 'PORK', 'CHICKEN', 'CHEESE', 'GREENS'];

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="bg-white px-3 py-2 flex flex-wrap gap-4 items-center border border-gray-200 shadow-sm">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onSelectCategory(cat)}
                        className={`text-xs font-black tracking-wider uppercase transition-colors ${activeCategory === cat ? 'text-[#FF7A38]' : 'text-black hover:text-gray-600'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="flex items-center">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white border border-r-0 border-gray-300 px-3 py-1.5 text-xs focus:outline-none w-48"
                />
                <button className="bg-black text-white text-xs font-black uppercase px-4 py-1.5 hover:bg-gray-800 transition-colors">
                    Search
                </button>
            </div>
        </div>
    );
}

function Footer() {
    return (
        <footer className="bg-[#FF7A38] text-white px-12 py-6 mt-auto">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-wide">
                <div className="text-left space-y-0.5">
                    <p className="font-black text-xs mb-1">Connect With Us:</p>
                    <p>Instagram: @MealyMunchies</p>
                    <p>FaceBook: @Mealy Munchies</p>
                    <p>TikTok: @MealyMunchies</p>
                </div>

                <div className="font-black text-2xl tracking-widest my-2 md:my-0">MEALY</div>

                <div className="text-right space-y-0.5">
                    <p className="font-black text-xs mb-1">For Any Inquiries:</p>
                    <p>Contact On Whatsapp:</p>
                    <p className="font-extrabold text-white">+254 720050025</p>
                </div>
            </div>
        </footer>
    );
}

export default function App() {
    const dispatch = useDispatch();

    const currentTab = useSelector((state) => state.activeTab?.currentTab || 'login');
    const selectedCategory = useSelector((state) => state.menu?.selectedCategory || 'ALL');
    const searchQuery = useSelector((state) => state.menu?.searchQuery || '');
    const orders = useSelector((state) => state.orders?.ordersList || []);

    const reduxUser = useSelector((state) => state.auth?.user);
    const currentUser = reduxUser || (() => {
        try {
            const saved = localStorage.getItem('mealyCurrentUser');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    })();

    const rawRole = currentUser?.role?.toLowerCase() || currentUser?.user_type?.toLowerCase() || '';
    const rawName = (currentUser?.name || currentUser?.username || '').toLowerCase();

    const userRole = (
        rawRole === 'caterer' ||
        rawRole === 'admin' ||
        currentUser?.isAdmin === true ||
        rawName.includes('admin')
    ) ? 'admin' : 'customer';

    const [cart, setCart] = useState([]);

    const [checkoutItems, setCheckoutItems] = useState(() => {
        try {
            const saved = localStorage.getItem('mealy_checkout_items');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const [menuNotification, setMenuNotification] = useState(() => {
        try {
            const savedNotice = localStorage.getItem('mealy_menu_notification');
            return savedNotice ? JSON.parse(savedNotice) : null;
        } catch (e) {
            return null;
        }
    });

    useEffect(() => {
        const restoreAuthentication = async () => {
            const accessToken = localStorage.getItem('mealyAccessToken');
            const refreshToken = localStorage.getItem('mealyRefreshToken');

            if (!accessToken || !refreshToken) {
                const storedUser = localStorage.getItem('mealyCurrentUser');
                if (storedUser) {
                    dispatch(restoreSession(JSON.parse(storedUser)));
                }
                return;
            }

            try {
                const response = await getCurrentUser(accessToken);
                const user = response.user || response;
                localStorage.setItem('mealyCurrentUser', JSON.stringify(user));
                dispatch(restoreSession({ user, access: accessToken, refresh: refreshToken }));
            } catch (accessError) {
                try {
                    const refreshed = await refreshAccessToken(refreshToken);
                    const newAccessToken = refreshed.access;
                    localStorage.setItem('mealyAccessToken', newAccessToken);

                    const response = await getCurrentUser(newAccessToken);
                    const user = response.user || response;
                    localStorage.setItem('mealyCurrentUser', JSON.stringify(user));
                    dispatch(restoreSession({ user, access: newAccessToken, refresh: refreshToken }));
                } catch (refreshError) {
                    localStorage.removeItem('mealyAccessToken');
                    localStorage.removeItem('mealyRefreshToken');
                    localStorage.removeItem('mealyCurrentUser');
                    dispatch(logout());
                    dispatch(setActiveTab('login'));
                }
            }
        };

        restoreAuthentication();
    }, [dispatch]);

    useEffect(() => {
        localStorage.setItem('mealy_checkout_items', JSON.stringify(checkoutItems));
    }, [checkoutItems]);

    const handleAddToCart = (item) => {
        if (!currentUser) {
            alert('Please log in or sign up to add items to your cart and make a purchase.');
            dispatch(setActiveTab('login'));
            return;
        }

        setCart((prevCart) => {
            const existing = prevCart.find((i) => i.id === item.id);
            if (existing) {
                return prevCart.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
        alert(`Added ${item.name || item.title} to your FoodCart!`);
    };

    const handleConfirmOrder = () => {
        setCheckoutItems([]);
        localStorage.removeItem('mealy_checkout_items');
        localStorage.removeItem('mealy_checkout_end_time');
        setCart([]);
    };

    const handleUpdateOrderStatus = (orderId, updatedFields) => {
        dispatch(updateOrderStatus({ orderId, status: updatedFields.status }));
    };

    const handleDeleteOrder = (orderId) => {
        dispatch(deleteOrder(orderId));
    };

    const handleDismissNotification = () => {
        localStorage.removeItem('mealy_menu_notification');
        setMenuNotification(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('mealyAccessToken');
        localStorage.removeItem('mealyRefreshToken');
        localStorage.removeItem('mealyCurrentUser');
        setCart([]);
        setCheckoutItems([]);
        dispatch(logout());
        dispatch(setActiveTab('login'));
    };

    const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const renderMainContent = () => {
        if (!currentUser) {
            return currentTab === 'signup' ? <SignupPage /> : <LoginPage />;
        }

        if (userRole === 'admin') {
            return (
                <AdminDashboardPage
                    orders={orders}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                    onDeleteOrder={handleDeleteOrder}
                />
            );
        }

        switch (currentTab) {
            case 'munchies':
            case 'customer-dashboard':
                return (
                    <div>
                        <SubHeader
                            activeCategory={selectedCategory}
                            onSelectCategory={(cat) => dispatch(setCategory(cat))}
                            searchQuery={searchQuery}
                            setSearchQuery={(query) => dispatch(setSearchQuery(query))}
                        />
                        <CustomerMenuPage
                            onAddToCart={handleAddToCart}
                            setCheckoutItem={(items) => {
                                setCheckoutItems(items);
                            }}
                        />
                    </div>
                );

            case 'foodcart':
                return (
                    <div className="bg-white p-6 shadow-md rounded max-w-2xl mx-auto">
                        <h2 className="font-black text-lg mb-4 border-b pb-2">YOUR FOODCART</h2>
                        {cart.length === 0 ? (
                            <p className="text-gray-500 text-sm">Your cart is currently empty.</p>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center border-b pb-3">
                                        <div>
                                            <p className="font-bold text-sm uppercase">{item.name || item.title}</p>
                                            <p className="text-xs text-gray-500">
                                                KSH {item.price} x {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-extrabold text-sm">KSH {item.price * item.quantity}</p>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-2 font-black text-base">
                                    <span>TOTAL:</span>
                                    <span>KSH {cartTotalPrice}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        setCheckoutItems(cart);
                                        dispatch(setActiveTab('checkout'));
                                    }}
                                    className="w-full bg-[#FF7A38] text-white text-xs font-black uppercase py-3 rounded hover:bg-orange-600 transition-colors mt-4"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </div>
                );

            case 'checkout':
                return (
                    <CheckoutPage
                        checkoutItems={checkoutItems}
                        onConfirmOrder={handleConfirmOrder}
                        onCancelCheckout={() => {
                            setCheckoutItems([]);
                            localStorage.removeItem('mealy_checkout_items');
                            dispatch(setActiveTab('munchies'));
                        }}
                    />
                );

            case 'myorders':
                const currentUserId = currentUser?.id || currentUser?.email || currentUser?.name;
                const userOrders = orders.filter((order) => {
                    const orderUserId = order.userId || order.customer?.email || order.customer?.name;
                    if (!orderUserId || !currentUserId) return false;
                    return String(orderUserId).trim().toLowerCase() === String(currentUserId).trim().toLowerCase();
                });

                return (
                    <CustomerOrderHistoryPage
                        orders={userOrders}
                        onUpdateOrderStatus={handleUpdateOrderStatus}
                    />
                );

            default:
                return (
                    <div>
                        <SubHeader
                            activeCategory={selectedCategory}
                            onSelectCategory={(cat) => dispatch(setCategory(cat))}
                            searchQuery={searchQuery}
                            setSearchQuery={(query) => dispatch(setSearchQuery(query))}
                        />
                        <CustomerMenuPage
                            onAddToCart={handleAddToCart}
                            setCheckoutItem={(items) => setCheckoutItems(items)}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#E5E5E5] flex flex-col justify-between">
            <div>
                <header className="bg-[#FF7A38] flex justify-between items-center px-12 py-5 shadow-md">
                    <div
                        className="font-black text-xl text-white tracking-widest cursor-pointer"
                        onClick={() => dispatch(setActiveTab(userRole === 'admin' ? 'caterer-dashboard' : 'munchies'))}
                    >
                        MEALY
                    </div>

                    <nav className="flex items-center gap-6">
                        {userRole === 'customer' && currentUser && (
                            <>
                                <button
                                    onClick={() => dispatch(setActiveTab('munchies'))}
                                    className={`text-white text-xs font-bold tracking-wide hover:text-black transition-colors ${currentTab === 'munchies' ? 'underline underline-offset-4 text-black' : ''
                                        }`}
                                >
                                    MUNCHIES
                                </button>
                                <button
                                    onClick={() => dispatch(setActiveTab('foodcart'))}
                                    className={`text-white text-xs font-bold tracking-wide hover:text-black transition-colors ${currentTab === 'foodcart' ? 'underline underline-offset-4 text-black' : ''
                                        }`}
                                >
                                    FOODCART ({totalCartItems})
                                </button>
                                <button
                                    onClick={() => dispatch(setActiveTab('myorders'))}
                                    className={`text-white text-xs font-bold tracking-wide hover:text-black transition-colors ${currentTab === 'myorders' ? 'underline underline-offset-4 text-black' : ''
                                        }`}
                                >
                                    MYORDERS
                                </button>
                            </>
                        )}

                        {currentUser ? (
                            <div className="flex items-center gap-4">
                                <span className="text-white text-xs font-black uppercase tracking-wider">
                                    {currentUser.name || currentUser.fullName || currentUser.username || currentUser.email}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white text-xs font-black uppercase px-3 py-1.5 rounded hover:bg-red-700 transition-colors"
                                >
                                    LOGOUT
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => dispatch(setActiveTab('signup'))}
                                    className={`text-white text-xs font-bold tracking-wide hover:text-black transition-colors ${currentTab === 'signup' ? 'underline underline-offset-4 text-black' : ''
                                        }`}
                                >
                                    SIGNUP
                                </button>
                                <button
                                    onClick={() => dispatch(setActiveTab('login'))}
                                    className={`text-white text-xs font-bold tracking-wide hover:text-black transition-colors ${currentTab === 'login' ? 'underline underline-offset-4 text-black' : ''
                                        }`}
                                >
                                    LOGIN
                                </button>
                            </>
                        )}
                    </nav>
                </header>

                {currentUser && userRole === 'customer' && menuNotification && (
                    <div className="bg-black text-white px-12 py-2.5 flex justify-between items-center text-xs font-bold border-b border-gray-800">
                        <span><strong className="text-[#FF7A38]">DAILY MENU ALERT:</strong> {menuNotification.message}</span>
                        <button
                            onClick={handleDismissNotification}
                            className="bg-[#FF7A38] text-white px-2.5 py-1 text-[10px] font-black uppercase rounded hover:bg-orange-600 transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                <main className="max-w-6xl mx-auto px-12 py-8">
                    {renderMainContent()}
                </main>
            </div>

            <Footer />
        </div>
    );
}