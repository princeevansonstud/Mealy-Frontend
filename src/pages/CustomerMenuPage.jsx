import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '../store/slices/activeTabSlice';
import { logout } from '../store/slices/authSlice';
import { logoutUser } from '../api/auth';
import FoodCard from '../components/FoodCard';

export default function CustomerMenuPage({ onAddToCart, setCheckoutItem }) {
  const dispatch = useDispatch();

  const { mealOptions = [], dailyMenu = [] } = useSelector((state) => state.mealManagement || {});
  const selectedCategory = useSelector((state) => state.menu?.selectedCategory || 'ALL');
  const searchQuery = useSelector((state) => state.menu?.searchQuery || '');

  // Check current user authentication status
  const reduxUser = useSelector((state) => state.auth?.user);
  const currentUser = reduxUser || (() => {
    try {
      const saved = localStorage.getItem('mealyCurrentUser');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  // Filter active meals for daily menu
  const activeMeals = mealOptions.filter((meal) => dailyMenu.includes(meal.id));

  // Filter by category and search term
  const filteredMeals = activeMeals.filter((meal) => {
    const activeCatUpper = selectedCategory.toUpperCase();

    const matchesCategory =
      selectedCategory === 'ALL' ||
      (meal.category && meal.category.toUpperCase() === activeCatUpper) ||
      meal.name?.toUpperCase().includes(activeCatUpper) ||
      meal.description?.toUpperCase().includes(activeCatUpper);

    const matchesSearch = meal.name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleBuyNow = (meal) => {
    // Block unauthenticated users and redirect straight to the login form
    if (!currentUser) {
      alert('Please log in or sign up to make a purchase.');
      dispatch(setActiveTab('login'));
      return;
    }

    if (typeof setCheckoutItem === 'function') {
      setCheckoutItem((prevItems) => {
        const currentItems = Array.isArray(prevItems) ? prevItems : [];
        const existingIndex = currentItems.findIndex((item) => item.id === meal.id);

        if (existingIndex !== -1) {
          const updated = [...currentItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: (updated[existingIndex].quantity || 1) + 1,
          };
          return updated;
        }

        return [
          ...currentItems,
          {
            id: meal.id,
            name: meal.name,
            price: meal.price,
            quantity: 1,
          },
        ];
      });
    }

    dispatch(setActiveTab('checkout'));
  };

  const handleAddToCart = (meal) => {
    if (typeof onAddToCart === 'function') {
      onAddToCart({
        id: meal.id,
        title: meal.name,
        price: meal.price,
        formattedPrice: `KSH ${meal.price}`,
      });
    }
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('mealyAccessToken');
    const refreshToken = localStorage.getItem('mealyRefreshToken');

    try {
      // Log out from the Django backend
      if (accessToken && refreshToken) {
        await logoutUser(accessToken, refreshToken);
      }
    } catch (error) {
      // Even if backend logout fails, clear the frontend session.
      console.error('Backend logout error:', error);
    } finally {
      // Remove ALL authentication data
      localStorage.removeItem('mealyAccessToken');
      localStorage.removeItem('mealyRefreshToken');
      localStorage.removeItem('mealyCurrentUser');

      // Clear Redux authentication state
      dispatch(logout());

      // Return to login page
      dispatch(setActiveTab('login'));
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-black text-lg uppercase">Today's Menu</h2>

        {currentUser && (
          <button
            onClick={handleLogout}
            className="bg-black text-white px-5 py-2 text-xs font-bold uppercase hover:bg-gray-800"
          >
            Logout
          </button>
        )}
      </div>

      {filteredMeals.length === 0 ? (
        <p className="text-center py-8 text-gray-500 font-bold">No meals available for today's menu.</p>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {filteredMeals.map((meal) => (
            <FoodCard
              key={meal.id}
              image={null}
              title={meal.name}
              price={`KSH ${meal.price}`}
              description={meal.description}
              onBuy={() => handleBuyNow(meal)}
              onAddToCart={() => handleAddToCart(meal)}
            />
          ))}
        </div>
      )}
    </div>
  );
}