const API_URL = 'http://127.0.0.1:8000/api/meals';

export async function getTodayMenu() {
  const response = await fetch(`${API_URL}/daily-menu/today/`, {
    method: 'GET',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      data.detail ||
      'Unable to load today\'s menu.'
    );
  }

  return data;
}

