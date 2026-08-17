import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../store/activeTabSlice'; // Adjust path if needed

const Navbar = () => {
    const dispatch = useDispatch();
    const activeTab = useSelector((state) => state.activeTab.value);

    const navItems = ['MUNCHIES', 'FOODCART', 'SIGNUP', 'LOGIN'];

    return (
        <header className="bg-[#FF7A00] text-white px-8 py-4 flex justify-between items-center shadow-md">
            {/* Logo */}
            <h1 className="text-2xl font-black tracking-wider cursor-pointer">
                MEALY
            </h1>

            {/* Navigation Buttons */}
            <nav className="flex gap-6 font-bold text-sm tracking-wide">
                {navItems.map((item) => (
                    <button
                        key={item}
                        onClick={() => dispatch(setActiveTab(item))}
                        className={`hover:text-black transition-colors ${activeTab === item ? 'border-b-2 border-white text-black' : ''
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </nav>
        </header>
    );
};

export default Navbar;