import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveTab } from '../store/slices/activeTabSlice';
import { registerUser } from '../api/auth';

function SignupPage() {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

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

    setLoading(true);

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        password_confirm: confirmPassword,
        role: role.toLowerCase(),
      });

      setSuccess(
        `${role === 'customer' ? 'Customer' : 'Caterer'} account created successfully! redirecting to login...`
      );

      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        dispatch(setActiveTab('login'));
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center px-6 py-8">
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
          <div>
            <label
              htmlFor="signup-name"
              className="block text-xs font-bold uppercase mb-1"
            >
              Name
            </label>

            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
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
              required
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
              placeholder="At least 8 characters"
              required
              className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[#FF7A38]"
            />
          </div>

          <div>
            <label
              htmlFor="signup-confirm-password"
              className="block text-xs font-bold uppercase mb-1"
            >
              Confirm Password
            </label>

            <input
              id="signup-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[#FF7A38]"
            />
          </div>

          <div>
            <label
              htmlFor="signup-role"
              className="block text-xs font-bold uppercase mb-1"
            >
              Role
            </label>

            <select
              id="signup-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[#FF7A38]"
            >
              <option value="customer">Customer</option>
              <option value="caterer">Caterer</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF7A38] text-white py-3 text-sm font-black uppercase hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
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