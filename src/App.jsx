import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from './store/slices/activeTabSlice';

// Food Card Component
function FoodCard({ title, price, description, onBuy, onAddToCart }) {
    return (
        <div className="w-80 bg-white shadow-md border border-gray-200 overflow-hidden flex flex-col">
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center border-b border-gray-200 overflow-hidden">
                <span className="text-gray-400 font-bold uppercase text-xs">IMAGE</span>
            </div>

            <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200">
                <span className="font-extrabold text-xs text-black tracking-wider uppercase">{title}</span>
                <span className="font-extrabold text-xs text-black tracking-wider uppercase">{price}</span>
            </div>

            <div className="bg-[#FF7A38] p-4 flex flex-col justify-between flex-1">
                <p className="text-white text-[11px] font-bold uppercase tracking-wider leading-relaxed mb-6">
                    {description}
                </p>

                <div className="flex gap-2">
                    <button
                        onClick={onBuy}
                        className="flex-1 bg-black text-white text-[10px] font-black uppercase tracking-wider py-2.5 rounded hover:bg-gray-800 transition-colors"
                    >
                        Buy Munchies
                    </button>
                    <button
                        onClick={onAddToCart}
                        className="flex-1 bg-black text-white text-[10px] font-black uppercase tracking-wider py-2.5 rounded hover:bg-gray-800 transition-colors"
                    >
                        Add To FoodCart
                    </button>
                </div>
            </div>
        </div>
    );
}

// Footer Component matched to Figma design
function Footer() {
    return (
        <footer className="bg-[#FF7A38] text-white px-12 py-6 mt-auto">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-wide">
                {/* Left: Social Contacts */}
                <div className="text-left space-y-0.5">
                    <p className="font-black text-xs mb-1">Connect With Us:</p>
                    <p>Instagram: @MealyMunchies</p>
                    <p>FaceBook: @Mealy Munchies</p>
                    <p>TikTok: @MealyMunchies</p>
                </div>

                {/* Center: Brand Logo */}
                <div className="font-black text-2xl tracking-widest my-2 md:my-0">
                    MEALY
                </div>

                {/* Right: Inquiries */}
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

    // Cart and Checkout State
    const [cart, setCart] = useState([]);
    const [checkoutItem, setCheckoutItem] = useState(null);

    const testItem = {
        id: 1,
        title: 'Beef with Rice',
        price: 450,
        formattedPrice: 'KSH 450',
        description: 'FOOD DESCRIPTION: Tender seasoned beef served over steamed rice with fresh sides.',
    };

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
        alert(`Added ${item.title} to your FoodCart!`);
    };

    const handleBuyNow = (item) => {
        setCheckoutItem(item);
        dispatch(setActiveTab('checkout'));
    };

    const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const navItems = [
        { label: 'MUNCHIES', tabKey: 'munchies' },
        { label: `FOODCART (${totalCartItems})`, tabKey: 'foodcart' },
        { label: 'SIGNUP', tabKey: 'signup' },
        { label: 'LOGIN', tabKey: 'login' },
    ];

    const renderTabContent = () => {
        switch (currentTab) {
            case 'munchies':
                return (
                    <div className="flex justify-center items-center py-6">
                        <FoodCard
                            title={testItem.title}
                            price={testItem.formattedPrice}
                            description={testItem.description}
                            onBuy={() => handleBuyNow(testItem)}
                            onAddToCart={() => handleAddToCart(testItem)}
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
                                            <p className="font-bold text-sm uppercase">{item.title}</p>
                                            <p className="text-xs text-gray-500">
                                                {item.formattedPrice} x {item.quantity}
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
                                        setCheckoutItem({ title: 'Cart Order', price: cartTotalPrice });
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
                    <div className="bg-white p-6 shadow-md rounded max-w-md mx-auto text-center">
                        <h2 className="font-black text-lg mb-2 uppercase">Checkout</h2>
                        {checkoutItem && (
                            <div className="my-4 p-4 bg-gray-50 rounded border">
                                <p className="font-bold text-sm">{checkoutItem.title}</p>
                                <p className="text-xl font-black text-[#FF7A38] mt-1">
                                    KSH {checkoutItem.price}
                                </p>
                            </div>
                        )}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                alert('Order placed successfully!');
                                setCart([]);
                                dispatch(setActiveTab('munchies'));
                            }}
                            className="space-y-3 mt-4"
                        >
                            <input
                                type="text"
                                placeholder="Delivery Address"
                                required
                                className="w-full border p-2 text-xs rounded"
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number (M-Pesa)"
                                required
                                className="w-full border p-2 text-xs rounded"
                            />
                            <button
                                type="submit"
                                className="w-full bg-black text-white text-xs font-black uppercase py-3 rounded hover:bg-gray-800 transition-colors"
                            >
                                Confirm & Pay
                            </button>
                        </form>
                    </div>
                );

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
            {/* Top Section */}
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

            {/* Footer */}
            <Footer />
        </div>
    );
}