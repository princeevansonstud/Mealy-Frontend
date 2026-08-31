const API_URL = 'https://mealy-backend-x1it.onrender.com';

function getAuthToken() {
  return (
    localStorage.getItem('mealyAccessToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('access') ||
    localStorage.getItem('access_token')
  );
}

export async function getTodayMenu() {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/daily-menu/today/`, {
    method: 'GET',
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      data.detail ||
      "Unable to load today's menu."
    );
  }

  return data;
}

export async function updateMealOption(id, updatedData) {
  const token = getAuthToken();

  if (!token) {
    throw new Error('No authentication token found. Please log in again.');
  }

  const cleanId = typeof id === 'object' ? (id.id || id._id) : id;

  const payload = {
    name: updatedData.name || updatedData.title || '',
    title: updatedData.title || updatedData.name || '',
    price: parseFloat(updatedData.price) || 0.0,
    description: updatedData.description || '',
    category: updatedData.category || 'BEEF',
  };

  const response = await fetch(`${API_URL}/options/${cleanId}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data.detail ||
      data.error ||
      data.message ||
      (typeof data === 'object' ? JSON.stringify(data) : 'Unable to update meal option.');

    throw new Error(errorMessage);
  }

  return data;
}