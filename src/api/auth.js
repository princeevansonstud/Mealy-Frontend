const API_URL = 'http://127.0.0.1:8000/api/auth';

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.email?.[0] ||
      data.password?.[0] ||
      data.password_confirm?.[0] ||
      data.role?.[0] ||
      data.name?.[0] ||
      data.detail ||
      'Registration failed.'
    );
  }

  return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      data.non_field_errors?.[0] ||
      data.error ||
      'Invalid credentials.'
    );
  }

  return data;
}

export async function getCurrentUser(accessToken) {
  const response = await fetch(`${API_URL}/me/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || 'Unable to restore session.'
    );
  }

  return data;
}

export async function refreshAccessToken(refreshToken) {
  const response = await fetch(`${API_URL}/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || 'Unable to refresh access token.'
    );
  }

  return data;
}

export async function logoutUser(accessToken, refreshToken) {
  const response = await fetch(`${API_URL}/logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || 'Logout failed.'
    );
  }

  return data;
}