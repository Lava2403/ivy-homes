const BASE_URL = "https://solve.ivy.homes";
const API_KEY = "IVY26-268F2047690B";

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    localStorage.clear();
    window.location.href = "/";
    throw new Error(data.detail || "Session expired");
  }

  // Save the new access token
  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);
  }

  // Save a new refresh token too, if the API provides one
  if (data.refresh_token) {
    localStorage.setItem("refresh_token", data.refresh_token);
  }

  return data.access_token;
}

export async function apiRequest(path, options = {}) {
  let accessToken = localStorage.getItem("access_token");

  const makeRequest = async (token) => {
    return fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
        ...(options.headers || {}),
      },
    });
  };

  let response = await makeRequest(accessToken);

  // Access token expired → refresh automatically
  if (response.status === 401) {
    try {
      accessToken = await refreshAccessToken();
      response = await makeRequest(accessToken);
    } catch (error) {
      throw error;
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }

  return data;
}

export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },

    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data;
}