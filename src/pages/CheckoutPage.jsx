import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveTab } from '../store/slices/activeTabSlice';

export default function CheckoutPage({ checkoutItems = [], onConfirmOrder }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });

  const itemsToDisplay = checkoutItems.length > 0 ? checkoutItems : [
    { name: 'Beef with Rice', price: 250, quantity: 1 }
  ];

  // Calculate total by multiplying price by quantity
  const totalAmount = itemsToDisplay.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
    0
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    dispatch(setActiveTab('munchies'));
  };

  const handleAddMore = () => {
    dispatch(setActiveTab('munchies'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onConfirmOrder) {
      onConfirmOrder(formData, itemsToDisplay);
    }
    dispatch(setActiveTab('myorders'));
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6">
      <h1 className="text-2xl font-black text-center mb-8 uppercase tracking-wide">Checkout</h1>

      <div className="flex flex-col md:flex-row justify-between items-center md:items-stretch gap-6">
        <div className="w-full md:w-5/12 bg-white border-4 border-[#FF7A38] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <h2 className="text-center font-bold text-base mb-6 underline">Checkout Form :</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <label className="font-extrabold text-sm w-32">Name :</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="flex-1 bg-gray-200 p-2 text-xs rounded outline-none font-medium"
                required
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <label className="font-extrabold text-sm w-32">Address :</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="flex-1 bg-gray-200 p-2 text-xs rounded outline-none font-medium"
                required
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <label className="font-extrabold text-sm w-32">Phone Number :</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="flex-1 bg-gray-200 p-2 text-xs rounded outline-none font-medium"
                required
              />
            </div>

            <div className="flex justify-between items-center pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-red-600 text-white font-extrabold text-xs px-5 py-2.5 rounded hover:bg-red-700 transition-colors uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white font-extrabold text-xs px-5 py-2.5 rounded hover:bg-green-600 transition-colors uppercase"
              >
                Confirm Order
              </button>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-center my-4 md:my-0">
          <button
            type="button"
            onClick={handleAddMore}
            className="bg-[#FF7A38] text-white font-black text-xs px-4 py-3 rounded-xl shadow-md hover:bg-orange-600 transition-colors uppercase text-center tracking-wide"
          >
            Add More Munchies
          </button>
        </div>

        <div className="w-full md:w-5/12 bg-white rounded-lg p-6 shadow-sm flex flex-col min-h-[320px]">
          <h2 className="text-center font-bold text-base mb-2">Processing Your Order</h2>
          <hr className="border-black mb-6" />

          <div className="flex justify-between font-extrabold text-xs mb-4">
            <span>Food Name:</span>
            <span>Price (KSH) :</span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-48 pr-1">
            {itemsToDisplay.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs font-semibold border-b border-gray-100 pb-2">
                <span>
                  {item.name || item.title} {item.quantity > 1 ? `(x${item.quantity})` : ''}
                </span>
                <span>{item.price * (item.quantity || 1)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-extrabold text-sm pt-4 border-t border-gray-200 mt-auto">
            <span>Total Amount :</span>
            <span>KSH {totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}