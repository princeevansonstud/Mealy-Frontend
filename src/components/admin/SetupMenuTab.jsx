import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDailyMenuMeal } from '../../store/slices/mealManagementSlice';

export default function SetupMenuTab() {
    const dispatch = useDispatch();
    const { mealOptions, dailyMenu } = useSelector((state) => state.mealManagement);

    return (
        <div className="bg-white min-h-[500px] w-full p-8 shadow-sm rounded-sm">
            <div className="border-b pb-4 mb-6">
                <h1 className="text-xl font-bold text-gray-800">Set Today's Menu</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Select the meal options available for customers to order today.
                </p>
            </div>

            {/* Daily Menu Grid */}
            {mealOptions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p>No meal options available in the system.</p>
                    <p className="text-xs mt-1">Please add meal options under the "Meal Options" tab first.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mealOptions.map((meal) => {
                        const isSelected = dailyMenu.includes(meal.id);

                        return (
                            <div
                                key={meal.id}
                                onClick={() => dispatch(toggleDailyMenuMeal(meal.id))}
                                className={`p-4 rounded-md border-2 cursor-pointer transition-all flex flex-col justify-between ${
                                    isSelected
                                        ? 'border-peach-orange bg-peach-orange/5 shadow-sm'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-base">{meal.name}</h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {meal.description || 'No description provided.'}
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => {}} // Handled by outer card click
                                        className="w-5 h-5 accent-peach-orange cursor-pointer mt-0.5"
                                    />
                                </div>

                                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-sm font-bold text-peach-orange">
                                        KSh {typeof meal.price === 'number' ? meal.price.toFixed(2) : meal.price}
                                    </span>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded font-medium ${
                                            isSelected
                                                ? 'bg-peach-orange text-white'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {isSelected ? 'On Menu' : 'Click to Add'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}