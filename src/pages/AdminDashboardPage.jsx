import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { setActiveTab } from '../store/slices/activeTabSlice';
import { logoutUser } from '../api/auth';

function AdminDashboardPage() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const accessToken =
      localStorage.getItem('mealyAccessToken');

    const refreshToken =
      localStorage.getItem('mealyRefreshToken');

    try {
      // Tell the Django backend to invalidate the refresh token.
      if (accessToken && refreshToken) {
        await logoutUser(
          accessToken,
          refreshToken
        );
      }
    } catch (error) {
      console.error(
        'Backend logout error:',
        error
      );
    } finally {
      // Always clear the frontend session.
      // This runs even if the backend logout fails.

      localStorage.removeItem(
        'mealyAccessToken'
      );

      localStorage.removeItem(
        'mealyRefreshToken'
      );

      localStorage.removeItem(
        'mealyCurrentUser'
      );

      // Clear Redux authentication state.
      dispatch(logout());

      // Return to login page.
      dispatch(
        setActiveTab('login')
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E5E5] px-6 py-10">
      <div className="max-w-6xl mx-auto">

        <div className="bg-white shadow-md p-8">

          <div className="flex justify-between items-center">

            <div>
              <h1 className="text-2xl font-black mb-2">
                CATERER DASHBOARD
              </h1>

              <p className="text-gray-600">
                Welcome to your Mealy caterer dashboard.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-black text-white px-5 py-2 text-sm font-bold uppercase hover:bg-gray-800"
            >
              Logout
            </button>

          </div>

          <div className="mt-6">

            <h2 className="text-lg font-bold">
              Manage Mealy
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Your meal management and orders will appear here.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminDashboardPage;