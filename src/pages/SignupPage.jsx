import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveTab } from '../store/slices/activeTabSlice';
import { loginSuccess } from '../store/slices/authSlice';

function SignupPage() {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const storedUsers = localStorage.getItem('mealyUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const existingUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      setError('An account with this email already exists.');
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: 'customer',
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('mealyUsers', JSON.stringify(updatedUsers));

    const loggedInUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    // Save active session & update Redux auth state
    localStorage.setItem('mealyCurrentUser', JSON.stringify(loggedInUser));
    dispatch(loginSuccess(loggedInUser));

    // Redirect directly to menu
    dispatch(setActiveTab('munchies'));
  };

  return (
    <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md bg-white shadow-md p-8">

        <h1 className="text-2xl font-black text-center mb-2">
          SIGN UP
        </h1>

        <p className="text-center text-sm text-gray-500 mb-6">
          Create your Mealy account
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label
              htmlFor="name"
              className="block text-xs font-bold uppercase mb-1"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[#FF7A38]"
            />
          </div>

          <div>
            <label
              htmlFor="signup-email"
              className="block text-xs font-bold uppercase mb-1"
            >
              Email
            </label>

            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[#FF7A38]"
            />
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="block text-xs font-bold uppercase mb-1"
            >
              Password
            </label>

            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[#FF7A38]"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-xs font-bold uppercase mb-1"
            >
              Confirm Password
            </label>

            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[#FF7A38]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF7A38] text-white py-3 text-sm font-black uppercase hover:bg-orange-600 transition-colors"
          >
            Create Account
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => dispatch(setActiveTab('login'))}
            className="text-[#FF7A38] font-bold hover:underline"
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default SignupPage;