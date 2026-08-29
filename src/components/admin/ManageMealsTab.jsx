import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    addMeal,
    updateMeal,
    deleteMeal,
} from '../../store/slices/mealManagementSlice';

const CATEGORIES = ['VEGAN', 'BEEF', 'PORK', 'CHICKEN', 'CHEESE', 'GREENS'];

export default function ManageMealsTab() {
    const dispatch = useDispatch();
    const { mealOptions = [], status } = useSelector(
        (state) => state.mealManagement || {}
    );

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: 'BEEF',
    });
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price) return;

        const priceNum = Number(formData.price);
        const payload = {
            name: formData.name,
            price: priceNum,
            description: formData.description,
            category: formData.category,
        };

        setSubmitting(true);
        try {
            if (editingId) {
                await dispatch(
                    updateMeal({ id: editingId, ...payload })
                ).unwrap();
                setEditingId(null);
            } else {
                dispatch(addMeal(payload));
            }
            setFormData({ name: '', price: '', description: '', category: 'BEEF' });
        } catch (err) {
            alert(`Operation failed: ${err?.message || err || 'An error occurred'}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (meal) => {
        const targetId = Number(meal.id ?? meal._id);
        setEditingId(targetId);

        setFormData({
            name: meal.name || meal.title || '',
            price: meal.price || '',
            description: meal.description || '',
            category: meal.category || 'BEEF',
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({ name: '', price: '', description: '', category: 'BEEF' });
    };

    const handleDelete = async (mealId) => {
        if (!window.confirm('Are you sure you want to delete this meal option?')) return;
        try {
            await dispatch(deleteMeal(mealId)).unwrap();
        } catch (err) {
            alert(`Delete failed: ${err?.message || err || 'An error occurred'}`);
        }
    };

    return (
        <div className="bg-white p-6 shadow-sm rounded">
            <h2 className="text-xl font-black mb-4">Meal Options</h2>

            <form
                onSubmit={handleSubmit}
                className="bg-gray-50 p-4 border rounded mb-6 flex flex-col md:flex-row gap-3 items-end"
            >
                <div className="flex-1">
                    <label className="text-xs font-bold block mb-1">Meal Name *</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-1.5 text-xs bg-white"
                        placeholder="e.g. Beef with Rice"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div className="w-36">
                    <label className="text-xs font-bold block mb-1">Category *</label>
                    <select
                        className="w-full border px-3 py-1.5 text-xs bg-white font-bold"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-32">
                    <label className="text-xs font-bold block mb-1">Price (KSh) *</label>
                    <input
                        type="number"
                        className="w-full border px-3 py-1.5 text-xs bg-white"
                        placeholder="e.g. 450"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                    />
                </div>

                <div className="flex-1">
                    <label className="text-xs font-bold block mb-1">Description</label>
                    <input
                        type="text"
                        className="w-full border px-3 py-1.5 text-xs bg-white"
                        placeholder="e.g. Served with steamed veggies"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-[#FF7A38] text-white text-xs font-black uppercase px-4 py-2 hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                        {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Meal'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-400 text-white text-xs font-black uppercase px-3 py-2 hover:bg-gray-500 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <table className="w-full text-left border-collapse text-xs">
                <thead>
                    <tr className="border-b text-gray-500 font-bold uppercase">
                        <th className="py-2">Meal Name</th>
                        <th className="py-2">Category</th>
                        <th className="py-2">Description</th>
                        <th className="py-2">Price</th>
                        <th className="py-2 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {status === 'loading' ? (
                        <tr>
                            <td colSpan="5" className="py-4 text-center text-gray-400">
                                Loading meals...
                            </td>
                        </tr>
                    ) : mealOptions.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="py-4 text-center text-gray-400">
                                No meal options available. Add one above!
                            </td>
                        </tr>
                    ) : (
                        mealOptions.map((meal) => {
                            const mealId = Number(meal.id ?? meal._id);
                            return (
                                <tr key={mealId} className="border-b hover:bg-gray-50">
                                    <td className="py-3 font-bold uppercase">{meal.name || meal.title}</td>
                                    <td className="py-3 font-bold text-[#FF7A38]">
                                        {meal.category || 'BEEF'}
                                    </td>
                                    <td className="py-3 text-gray-600">{meal.description}</td>
                                    <td className="py-3 font-bold">KSH {meal.price}</td>
                                    <td className="py-3 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(meal)}
                                            className="text-blue-600 font-bold hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(mealId)}
                                            className="text-red-600 font-bold hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}