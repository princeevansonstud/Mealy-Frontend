import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '../store/slices/activeTabSlice';
import FoodCard from '../components/FoodCard';

export default function CustomerMenuPage({ onAddToCart, setCheckoutItem }) {
  const dispatch = useDispatch();
  const { mealOptions = [], dailyMenu = [] } = useSelector((state) => state.mealManagement || {});
  const selectedCategory = useSelector((state) => state.menu?.selectedCategory || 'ALL');
  const searchQuery = useSelector((state) => state.menu?.searchQuery || '');

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
    if (typeof setCheckoutItem === 'function') {
      setCheckoutItem((prevItems) => {
        // Ensure prevItems is an array
        const currentItems = Array.isArray(prevItems) ? prevItems : [];
        const existingIndex = currentItems.findIndex((item) => item.id === meal.id);

        if (existingIndex !== -1) {
          // Increment quantity if item already exists on the receipt
          const updated = [...currentItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: (updated[existingIndex].quantity || 1) + 1,
          };
          return updated;
        }

        // Append new item to existing receipt list
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

  return (
    <div>
      <h1 className="font-black text-lg mb-4 uppercase">Today's Menu</h1>
      {filteredMeals.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No meals available for today's menu.</p>
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