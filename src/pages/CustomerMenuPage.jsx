import React, { useEffect } from 'react';
import beefWithRiceImg from '../assets/meals/beef-with-rice.avif';
import beefWithFriesImg from '../assets/meals/beef-with-fries.avif';
import chickenStewImg from '../assets/meals/chicken-stew-with-ugali.avif';
import veganBowlImg from '../assets/meals/vegan-buddha-bowl.avif';
import cheesyWrapImg from '../assets/meals/cheesy-greens-wrap.avif';
import porkRibsImg from '../assets/meals/pork-ribs-with-mash.avif';
import macAndCheeseImg from '../assets/meals/mac-and-cheese.avif';
import kaleAvocadoImg from '../assets/meals/kale-and-avocado.avif';
import chickenPilauImg from '../assets/meals/chicken-pilau.avif';

import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '../store/slices/activeTabSlice';
import FoodCard from '../components/FoodCard';

export default function CustomerMenuPage({ onAddToCart, setCheckoutItem }) {
  const dispatch = useDispatch();

  const { mealOptions = [], dailyMenu = [] } = useSelector((state) => state.mealManagement || {});
  const selectedCategory = useSelector((state) => state.menu?.selectedCategory || 'ALL');
  const searchQuery = useSelector((state) => state.menu?.searchQuery || '');

  const reduxUser = useSelector((state) => state.auth?.user);
  const currentUser = reduxUser || (() => {
    try {
      const saved = localStorage.getItem('mealyCurrentUser');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  const activeMeals = mealOptions.filter((meal) => dailyMenu.includes(meal.id));

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

  const localImageMap = {
    'Beef with Rice': beefWithRiceImg,
    'Beef with Fries': beefWithFriesImg,
    'Chicken Stew with Ugali': chickenStewImg,
    'Vegan Buddha Bowl': veganBowlImg,
    'Cheesy Greens Wrap': cheesyWrapImg,
    'Pork Ribs with Mash': porkRibsImg,
    'Mac and Cheese': macAndCheeseImg,
    'Kale and Avocado Bowl': kaleAvocadoImg,
    'Chicken Pilau': chickenPilauImg,
  };

  const getMealImage = (meal) => {
    return localImageMap[meal.name] || meal.image_url || null;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-black text-lg uppercase">Today's Menu</h2>
      </div>

      {filteredMeals.length === 0 ? (
        <p className="text-center py-8 text-gray-500 font-bold">No meals available for today's menu.</p>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {filteredMeals.map((meal) => (
            <FoodCard
              key={meal.id}
              image={getMealImage(meal)}
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