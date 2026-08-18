import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveTab } from '../store/slices/activeTabSlice';

function SignupPage() {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    // Check that all fields are filled
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    // Check password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    // Check that passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Get existing users from localStorage
    const storedUsers = localStorage.getItem('mealyUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    // Check if email already exists
    const existingUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      setError('An account with this email already exists.');
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role,
    };

    // Add the new user to the existing users
    const updatedUsers = [...users, newUser];

    // Save users to localStorage
    localStorage.setItem('mealyUsers', JSON.stringify(updatedUsers));

    setSuccess(
      `${role === 'customer' ? 'Customer' : 'Caterer'} account created successfully!`
    );

    // Clear the form
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRole('customer');
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

        {success && (
          <div className="bg-green-100 text-green-700 text-sm p-3 mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
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

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
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

          {/* Account Type */}
          <div>
            <label
              htmlFor="role"
              className="block text-xs font-bold uppercase mb-1"
            >
              Account Type
            </label>

            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[#FF7A38]"
            >
              <option value="customer">Customer</option>
              <option value="caterer">Caterer</option>
            </select>
          </div>

          {/* Submit */}
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