import React from 'react';

function CustomerMenuPage() {
  return (
    <div className="min-h-screen bg-[#E5E5E5] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-md p-8">
          <h1 className="text-2xl font-black mb-2">
            CUSTOMER DASHBOARD
          </h1>

          <p className="text-gray-600">
            Welcome to your Mealy customer dashboard.
          </p>

          <div className="mt-6">
            <h2 className="text-lg font-bold">
              Today's Menu
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Your available meals will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerMenuPage;
