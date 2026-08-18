import React, { useState } from 'react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Login submitted:', {
      email,
      password,
    });
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase mb-1"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[#FF7A38]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase mb-1"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:border-[#FF7A38]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF7A38] text-white py-3 text-sm font-black uppercase hover:bg-orange-600 transition-colors"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <button className="text-[#FF7A38] font-bold hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
