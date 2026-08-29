import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../store/slices/activeTabSlice';
import { addOrder } from '../store/slices/orderSlice';

export default function CheckoutPage({ checkoutItems = [], onConfirmOrder, onCancelCheckout }) {
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  const currentUser = authState?.user || (() => {
    try {
      const saved = localStorage.getItem('mealyCurrentUser') || localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  const token =
    authState?.token ||
    currentUser?.token ||
    currentUser?.access_token ||
    localStorage.getItem('mealyAccessToken') ||
    localStorage.getItem('mealyToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('access_token');

  const [formData, setFormData] = useState({
    name: currentUser?.name || currentUser?.username || '',
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
    id: item.daily_menu_item_id || item.id,
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
      if (cleanedValue.length <= 12) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (itemsToDisplay.length === 0) {
      alert('Your checkout is empty! Please add items to order.');
      dispatch(setActiveTab('munchies'));
      return;
    }

    const cleanedPhone = formData.phone.trim().replace(/[\s-]/g, '');
    const formattedPhone = cleanedPhone.replace(/^(?:\+254|0)/, '254');

    if (!/^254(7|1)\d{8}$/.test(formattedPhone)) {
      setPhoneError('Please enter a valid Safaricom phone number (e.g., 0712345678).');
      return;
    }

    setIsProcessingStk(true);
    setPhoneError('');

    try {
      const payload = {
        phone_number: formattedPhone,
        total_amount: totalAmount,
        items: itemsToDisplay.map((item) => ({
          daily_menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price,
          unit_price: item.price,
        })),
      };

      const cleanToken = token ? token.replace(/^Bearer\s+/i, '').replace(/"/g, '') : '';

      const headers = {
        'Content-Type': 'application/json',
        ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
      };

      let response;
      try {
        response = await fetch('http://127.0.0.1:8000/api/orders/', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
      } catch (err) {
        response = await fetch('http://localhost:8000/api/orders/', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
      }

      const responseText = await response.text();
      let data = {};
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        data = { error: responseText };
      }

      if (response.ok) {
        const createdOrderId = data.id || data.orderId;

        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(`http://127.0.0.1:8000/api/orders/${createdOrderId}/status/`, {
              headers: { Authorization: `Bearer ${cleanToken}` }
            });
            const statusData = await statusRes.json();

            if (
              statusData.status === 'Paid' ||
              statusData.status === 'Completed' ||
              statusData.status === 'Success'
            ) {
              clearInterval(pollInterval);
              setIsProcessingStk(false);

              const orderPayload = {
                id: createdOrderId,
                customerName: formData.name,
                customerEmail: currentUser?.email || '',
                userId: currentUser?.id || '',
                deliveryAddress: formData.address,
                phone: formattedPhone,
                items: itemsToDisplay,
                totalAmount: data.total_amount || totalAmount,
                status: 'Paid',
                createdAt: data.created_at || new Date().toISOString(),
              };

              dispatch(addOrder(orderPayload));
              if (onConfirmOrder) onConfirmOrder();
              setFormData({ name: '', address: '', phone: '' });
              dispatch(setActiveTab('myorders'));
            } else if (
              statusData.status === 'Payment Failed' ||
              statusData.status === 'Cancelled'
            ) {
              clearInterval(pollInterval);
              setIsProcessingStk(false);
              alert('Payment failed or was cancelled on your phone.');
            }
          } catch (err) {
            console.error('Error polling order status:', err);
          }
        }, 2000);

        setTimeout(() => {
          clearInterval(pollInterval);
          setIsProcessingStk((currentlyProcessing) => {
            if (currentlyProcessing) {
              alert('Payment completed or timed out. Redirecting to My Orders...');
              dispatch(setActiveTab('myorders'));
            }
            return false;
          });
        }, 30000);

      } else {
        setIsProcessingStk(false);
        const errorMessage = typeof data === 'object' ? JSON.stringify(data) : data;
        alert(errorMessage || 'Failed to initiate M-Pesa payment.');
      }
    } catch (error) {
      setIsProcessingStk(false);
      console.error('STK Push Error:', error);
      alert('Could not connect to backend server. Make sure Django is running on http://127.0.0.1:8000.');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 relative">
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

        <div className="flex items-center justify-center my-4 md:my-0">
          <button
            type="button"
            onClick={handleAddMore}
            className="bg-[#FF7A38] text-[#ffffff] font-black text-xs px-4 py-3 rounded-xl shadow-md hover:bg-orange-600 transition-colors uppercase text-center tracking-wide"
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