import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from './store/slices/activeTabSlice';
import { setCategory, setSearchQuery } from './store/slices/menuSlice';

import CustomerMenuPage from './pages/CustomerMenuPage';
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

                <div className="font-black text-2xl tracking-widest my-2 md:my-0">
                    MEALY
                </div>

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
    const currentTab = useSelector((state) => state.activeTab.currentTab);
    const selectedCategory = useSelector((state) => state.menu.selectedCategory);
    const searchQuery = useSelector((state) => state.menu.searchQuery);

    const [cart, setCart] = useState([]);
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('mealy_orders');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('mealy_orders', JSON.stringify(orders));
    }, [orders]);

    const handleAddToCart = (item) => {
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

    const handleConfirmOrder = (customerDetails, items) => {
        const newOrder = {
            id: Date.now(),
            customer: customerDetails,
            items: items,
            timestamp: new Date().toISOString()
        };
        setOrders((prev) => [...prev, newOrder]);
        setCheckoutItems([]);
    };

    const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const navItems = [
        { label: 'MUNCHIES', tabKey: 'munchies' },
        { label: `FOODCART (${totalCartItems})`, tabKey: 'foodcart' },
        { label: 'MYORDERS', tabKey: 'myorders' },
        { label: 'SIGNUP', tabKey: 'signup' },
        { label: 'LOGIN', tabKey: 'login' },
    ];

    const renderTabContent = () => {
        switch (currentTab) {
            case 'munchies':
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
                            setCheckoutItem={(item) => setCheckoutItems((prev) => [...prev, item])}
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
                    />
                );

            case 'myorders':
                return <CustomerOrderHistoryPage orders={orders} />;

            case 'signup':
                return <div className="p-8 bg-white shadow-sm rounded text-center">Signup Form View</div>;

            case 'login':
                return <div className="p-8 bg-white shadow-sm rounded text-center">Login Form View</div>;

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#E5E5E5] flex flex-col justify-between">
            <div>
                <header className="bg-[#FF7A38] flex justify-between items-center px-12 py-5">
                    <div
                        className="font-black text-xl text-white tracking-widest cursor-pointer"
                        onClick={() => dispatch(setActiveTab('munchies'))}
                    >
                        MEALY
                    </div>

                    <nav className="flex gap-6">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => dispatch(setActiveTab(item.tabKey))}
                                className={`text-white text-xs font-bold tracking-wide hover:text-black transition-colors ${currentTab === item.tabKey ? 'underline underline-offset-4 text-black' : ''
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </header>

                <main className="max-w-6xl mx-auto px-12 py-8">
                    {renderTabContent()}
                </main>
            </div>

            <Footer />
        </div>
    );
}