import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodayMenu } from '../store/slices/menuSlice';
import { setActiveTab } from '../store/slices/activeTabSlice';
import FoodCard from '../components/FoodCard';

export default function CustomerMenuPage({ onAddToCart, setCheckoutItem }) {
  const dispatch = useDispatch();
  const { todayMenu, status, error, selectedCategory, searchQuery } = useSelector((state) => state.menu);

  useEffect(() => {
    dispatch(fetchTodayMenu());
  }, [dispatch]);

  if (status === 'loading') {
    return <p className="text-center py-8">Loading today's menu...</p>;
  }

  if (status === 'failed') {
    return <p className="text-center py-8 text-red-600">Something went wrong: {error}</p>;
  }

  if (status === 'succeeded' && !todayMenu) {
    return <p className="text-center py-8">No menu has been set for today yet. Check back soon!</p>;
  }

  const handleBuyNow = (meal) => {
    // 1. Pass item to parent state or store
    if (setCheckoutItem) {
      setCheckoutItem({
        name: meal.name,
        price: meal.price
      });
    }
    // 2. Switch Redux tab to 'checkout'
    dispatch(setActiveTab('checkout'));
  };

  const filteredMeals = todayMenu?.mealOptions.filter((meal) => {
    const matchesCategory = selectedCategory === 'ALL' || meal.category === selectedCategory;
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <h1 className="font-black text-lg mb-4 uppercase">Today's Menu</h1>
      {filteredMeals?.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No meals match your search or filter.</p>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {filteredMeals?.map((meal) => (
            <FoodCard
              key={meal.id}
              image={null}
              title={meal.name}
              price={`KSH ${meal.price}`}
              description={meal.description}
              onBuy={() => handleBuyNow(meal)}
              onAddToCart={() =>
                onAddToCart({
                  id: meal.id,
                  title: meal.name,
                  price: meal.price,
                  formattedPrice: `KSH ${meal.price}`,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}