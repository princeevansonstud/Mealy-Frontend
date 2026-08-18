// src/pages /CustomerMenuPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodayMenu, selectMeal, clearSelection } from '../store/slices/menuSlice';
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

  const selectedMeal = todayMenu?.mealOptions.find((m) => m.id === selectedMealId);

  // If a meal is already selected, show the confirmation view instead of the full grid
  if (selectedMeal) {
    return (
      <div className="flex flex-col items-center py-6">
        <div className="w-80 bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 font-bold uppercase text-xs">IMAGE</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-800 tracking-wide uppercase">{selectedMeal.name}</h3>
            <span className="font-black text-xs text-black">KSH {selectedMeal.price}</span>
          </div>
          <div className="bg-[#FF7A38] p-4 text-white">
            <p className="text-xs uppercase font-medium leading-relaxed tracking-wider">
              {selectedMeal.description}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm font-bold text-center">
          ✅ Order confirmed: {selectedMeal.name}
        </p>
        <button
          onClick={() => dispatch(clearSelection())}
          className="mt-2 text-xs font-black uppercase underline text-[#FF7A38] hover:text-orange-700"
        >
          Change my choice
        </button>
      </div>
    );
  }

  // No selection yet — show the full menu grid
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
    </div>
  );
}