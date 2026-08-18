// src/pages /CustomerMenuPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodayMenu, selectMeal } from '../store/slices/menuSlice';
import FoodCard from '../components/FoodCard';

export default function CustomerMenuPage() {
  const dispatch = useDispatch();
  const { todayMenu, status, error, selectedMealId } = useSelector((state) => state.menu);

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

  return (
    <div>
      <h1 className="font-black text-lg mb-4 uppercase">Today's Menu</h1>
      <div className="flex flex-wrap gap-6 justify-center">
        {todayMenu?.mealOptions.map((meal) => (
          <FoodCard
            key={meal.id}
            image={null}
            title={meal.name}
            price={`KSH ${meal.price}`}
            description={meal.description}
            onBuy={() => dispatch(selectMeal(meal.id))}
            onAddToCart={() => dispatch(selectMeal(meal.id))}
          />
        ))}
      </div>
      {selectedMealId && (
        <p className="text-center mt-4 text-sm font-bold">
          You selected: {todayMenu.mealOptions.find((m) => m.id === selectedMealId)?.name}
        </p>
      )}
    </div>
  );
}