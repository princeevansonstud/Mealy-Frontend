import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMealOption, editMealOption, deleteMealOption } from '../../store/slices/mealManagementSlice';

export default function ManageMealsTab() {
    const dispatch = useDispatch();
    const { mealOptions } = useSelector((state) => state.mealManagement);

    // Form state for creating and editing meals
    const [form, setForm] = useState({ id: null, name: '', price: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);

    // Handle form submit (Add or Update)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.price) return;

        if (isEditing) {
            dispatch(editMealOption({ ...form, price: parseFloat(form.price) }));
            setIsEditing(false);
        } else {
            dispatch(addMealOption({ name: form.name, price: parseFloat(form.price), description: form.description }));
        }

        // Reset form
        setForm({ id: null, name: '', price: '', description: '' });
    };

    // Populate form for editing
    const handleEdit = (meal) => {
        setForm(meal);
        setIsEditing(true);
    };

    // Cancel edit state
    const handleCancelEdit = () => {
        setIsEditing(false);
        setForm({ id: null, name: '', price: '', description: '' });
    };

    return (
        <div className="bg-white min-h-[500px] w-full p-8 shadow-sm rounded-sm">
            <h1 className="text-xl font-bold text-gray-800 border-b pb-4">Meal Options</h1>

            {/* Add / Edit Meal Form */}
            <form onSubmit={handleSubmit} className="bg-gray-50 p-5 rounded-md border border-gray-200 my-6">
                <h2 className="text-base font-semibold text-gray-700 mb-4">
                    {isEditing ? 'Edit Meal Option' : 'Add New Meal Option'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Meal Name *</label>
                        <input
                            type="text"
                            placeholder="e.g. Beef with Rice"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-peach-orange bg-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Price ($) *</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="e.g. 12.50"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-peach-orange bg-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <input
                            type="text"
                            placeholder="e.g. Served with steamed veggies"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-peach-orange bg-white"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="bg-peach-orange text-white px-5 py-2 text-sm rounded font-medium hover:opacity-90 transition-opacity"
                    >
                        {isEditing ? 'Update Meal' : 'Add Meal'}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-gray-300 text-gray-700 px-5 py-2 text-sm rounded font-medium hover:bg-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* Meals Table View */}
            <div className="overflow-x-auto mt-6">
                <table className="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr className="border-b-2 border-gray-200 text-gray-600 font-semibold">
                            <th className="py-3 px-2">Meal Name</th>
                            <th className="py-3 px-2">Description</th>
                            <th className="py-3 px-2">Price</th>
                            <th className="py-3 px-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {mealOptions.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-8 text-center text-gray-500">
                                    No meal options available. Add one above!
                                </td>
                            </tr>
                        ) : (
                            mealOptions.map((meal) => (
                                <tr key={meal.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-2 font-medium text-gray-800">{meal.name}</td>
                                    <td className="py-3 px-2 text-gray-500">{meal.description || '—'}</td>
                                    <td className="py-3 px-2 font-semibold text-gray-700">
                                        ${typeof meal.price === 'number' ? meal.price.toFixed(2) : meal.price}
                                    </td>
                                    <td className="py-3 px-2 text-right space-x-3">
                                        <button
                                            onClick={() => handleEdit(meal)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => dispatch(deleteMealOption(meal.id))}
                                            className="text-red-600 hover:text-red-800 font-medium text-xs"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}