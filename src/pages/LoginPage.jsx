import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '../store/slices/authSlice';

import { setActiveTab } from '../store/slices/activeTabSlice';
import { loginUser } from '../api/auth';

function LoginPage() {
  const dispatch = useDispatch();

  const { loading, error: authError } = useSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    dispatch(loginStart());

    if (!email || !password) {
      const message = 'Please enter your email and password.';
      setError(message);
      dispatch(loginFailure(message));
      return;
    }

    try {
      const data = await loginUser(email, password);

      localStorage.setItem('mealyAccessToken', data.access);
      localStorage.setItem('mealyRefreshToken', data.refresh);
      localStorage.setItem(
        'mealyCurrentUser',
        JSON.stringify(data.user)
      );

      dispatch(
        loginSuccess({
          user: data.user,
          access: data.access,
          refresh: data.refresh,
        })
      );

      if (data.user.role === 'customer') {
        dispatch(setActiveTab('customer-dashboard'));
      } else if (data.user.role === 'caterer') {
        dispatch(setActiveTab('caterer-dashboard'));
      }
    } catch (err) {
      const message = err.message || 'Invalid credentials.';

      setError(message);
      dispatch(loginFailure(message));
    }
  };

  const displayedError = error || authError;

  return (
    <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white shadow-md p-8">

        <h1 className="text-2xl font-black text-center mb-2">
          LOGIN
        </h1>

        <p className="text-center text-sm text-gray-500 mb-6">
          Welcome back to Mealy
        </p>

        {displayedError && (
          <div className="bg-red-100 text-red-700 text-sm p-3 mb-4">
            {displayedError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-bold uppercase mb-1"
            >
              Email
            </label>

            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[#FF7A38]"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-bold uppercase mb-1"
            >
              Password
            </label>

            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[#FF7A38]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF7A38] text-white py-3 text-sm font-black uppercase hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}

          <button
            type="button"
            onClick={() => dispatch(setActiveTab('signup'))}
            className="text-[#FF7A38] font-bold hover:underline"
          >
            Sign Up
          </button>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;