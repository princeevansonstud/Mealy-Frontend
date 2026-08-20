import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../store/slices/activeTabSlice';
import { addOrder } from '../store/slices/orderSlice';

export default function CheckoutPage({ checkoutItems = [], onConfirmOrder, onCancelCheckout }) {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth?.user) || (() => {
    try {
      const saved = localStorage.getItem('mealyCurrentUser');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });

  const [phoneError, setPhoneError] = useState('');
  const [isProcessingStk, setIsProcessingStk] = useState(false);

  const rawItems = Array.isArray(checkoutItems)
    ? checkoutItems
    : checkoutItems
      ? [checkoutItems]
      : [];

  const itemsToDisplay = rawItems.map((item) => ({
  name: item.name || item.title || 'Selected Meal',
  price: Number(item.price) || 0,
  quantity: item.quantity || 1,
  imageUrl: item.imageUrl,
}));

  const totalAmount = itemsToDisplay.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const cleanedValue = value.replace(/\D/g, '');
      if (cleanedValue.length <= 10) {
        setFormData((prev) => ({ ...prev, phone: cleanedValue }));
        if (phoneError) setPhoneError('');
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    if (onCancelCheckout) {
      onCancelCheckout();
    } else {
      dispatch(setActiveTab('munchies'));
    }
  };

  const handleAddMore = () => {
    dispatch(setActiveTab('munchies'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (itemsToDisplay.length === 0) {
      alert('Your checkout is empty! Please add items to order.');
      dispatch(setActiveTab('munchies'));
      return;
    }

    if (formData.phone.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits.');
      return;
    }

    setIsProcessingStk(true);

    setTimeout(() => {
      setIsProcessingStk(false);

      const orderPayload = {
        customerName: formData.name,
        customerEmail: currentUser?.email || '',
        userId: currentUser?.id || currentUser?._id || currentUser?.userId || currentUser?.name || '',
        deliveryAddress: formData.address,
        phone: formData.phone,
        items: itemsToDisplay,
        totalAmount: totalAmount,
      };

      // 1. Dispatch to Redux Store (ONLY dispatch location for order placement)
      dispatch(addOrder(orderPayload));

      // 2. Call parent callback without passing duplication data
      if (onConfirmOrder) {
        onConfirmOrder();
      }

      // 3. Reset form & navigate to order history page
      setFormData({ name: '', address: '', phone: '' });
      dispatch(setActiveTab('myorders'));
    }, 3000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 relative">
      {/* Simulated Frontend STK Push Overlay */}
      {isProcessingStk && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#FF7A38] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h3 className="font-black text-base uppercase">Sending M-Pesa Prompt...</h3>
            <p className="text-xs text-gray-600">
              Please check your phone (<strong>{formData.phone}</strong>) and enter your M-Pesa PIN to complete payment of <strong>KSH {totalAmount}</strong>.
            </p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-black text-center mb-8 uppercase tracking-wide">
        Checkout
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center md:items-stretch gap-6">
        {/* Form Card */}
        <div className="w-full md:w-5/12 bg-white border-4 border-[#FF7A38] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <h2 className="text-center font-bold text-base mb-6 underline">
            Checkout Form :
          </h2>

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

            <div>
              <div className="flex items-center justify-between gap-2">
                <label className="font-extrabold text-sm w-32">Phone Number :</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="07XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className="flex-1 bg-gray-200 p-2 text-xs rounded outline-none font-medium"
                  required
                />
              </div>
              <div className="flex justify-end mt-1">
                <div className="w-full pl-[8rem]">
                  <p className="text-[10px] text-gray-500 font-bold">For Mpesa Payment</p>
                  {phoneError && (
                    <p className="text-[10px] text-red-600 font-bold mt-0.5">{phoneError}</p>
                  )}
                </div>
              </div>
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
                className="bg-green-500 hover:bg-green-600 font-extrabold text-xs px-5 py-2.5 rounded transition-colors uppercase text-white"
              >
                Confirm Order
              </button>
            </div>
          </form>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-center my-4 md:my-0">
          <button
            type="button"
            onClick={handleAddMore}
            className="bg-[#FF7A38] text-white font-black text-xs px-4 py-3 rounded-xl shadow-md hover:bg-orange-600 transition-colors uppercase text-center tracking-wide"
          >
            Add More Munchies
          </button>
        </div>

        {/* Processing Order Details */}
        <div className="w-full md:w-5/12 bg-white rounded-lg p-6 shadow-sm flex flex-col min-h-[320px]">
          <h2 className="text-center font-bold text-base mb-2">Processing Your Order</h2>
          <hr className="border-black mb-6" />

          <div className="flex justify-between font-extrabold text-xs mb-4">
            <span>Food Name:</span>
            <span>Price (KSH) :</span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-48 pr-1">
            {itemsToDisplay.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-6">
                No items selected for checkout.
              </p>
            ) : (
              itemsToDisplay.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-xs font-semibold border-b border-gray-100 pb-2"
                >
                  <span>
                    {item.name} {item.quantity > 1 ? `(x${item.quantity})` : ''}
                  </span>
                  <span>{item.price * item.quantity}</span>
                </div>
              ))
            )}
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