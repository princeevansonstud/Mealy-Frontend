import React, { useState } from 'react';

import { useDispatch } from 'react-redux';

import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '../store/slices/authSlice';

import { setActiveTab } from '../store/slices/activeTabSlice';

function LoginPage() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    setError('');
    dispatch(loginStart());

    const storedUsers = localStorage.getItem('mealyUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const user = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    // Check email and password together
    if (!user || user.password !== password) {
      const errorMessage = 'Invalid credentials.';
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
      return;
    }

    const loggedInUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    localStorage.setItem(
      'mealyCurrentUser',
      JSON.stringify(loggedInUser)
    );

    dispatch(loginSuccess(loggedInUser));
    if (loggedInUser.role === 'customer') {
      dispatch(setActiveTab('customer-dashboard'));
    } else if (loggedInUser.role === 'caterer') {
      dispatch(setActiveTab('caterer-dashboard'));
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white shadow-md p-8">

        <h1 className="text-2xl font-black text-center mb-2">
          LOGIN
        </h1>

        <p className="text-center text-sm text-gray-500 mb-6">
          Welcome back to Mealy
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
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

          {/* Password */}
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

          {/* Login button */}
          <button
            type="submit"
            className="w-full bg-[#FF7A38] text-white py-3 text-sm font-black uppercase hover:bg-orange-600 transition-colors"
          >
            Login
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