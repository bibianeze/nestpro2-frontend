// ============================================================
// NESTFINDER PRO — API SERVICE
// All backend calls go through here
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// --- Save and get JWT token from localStorage ---
export const saveToken = (token: string) => localStorage.setItem("nestfinder_token", token);
export const getToken = () => localStorage.getItem("nestfinder_token");
export const removeToken = () => localStorage.removeItem("nestfinder_token");

// --- Build headers ---
const buildHeaders = (includeAuth = false): HeadersInit => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (includeAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// ============================================================
// AUTH
// ============================================================

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getCurrentUser = async () => {
  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: buildHeaders(true),
  });
  return res.json();
};

export const forgotPassword = async (email: string) => {
  const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ email }),
  });
  return res.json();
};

export const resetPassword = async (
  token: string,
  data: { password: string; confirmpassword: string }
) => {
  const res = await fetch(`${BASE_URL}/api/auth/reset-password/${token}`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

// ============================================================
// PROPERTIES
// ============================================================

export const getProperties = async () => {
  const res = await fetch(`${BASE_URL}/api/properties`, {
    method: "GET",
    headers: buildHeaders(),
  });
  return res.json();
};

export const getPropertyById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/properties/${id}`, {
    method: "GET",
    headers: buildHeaders(),
  });
  return res.json();
};

export const getAdminProperties = async () => {
  const res = await fetch(`${BASE_URL}/api/properties/admin/all`, {
    method: "GET",
    headers: buildHeaders(true),
  });
  return res.json();
};

export const createProperty = async (formData: FormData) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/api/properties`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return res.json();
};

export const updateProperty = async (id: string, formData: FormData) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/api/properties/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return res.json();
};

export const deleteProperty = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/properties/${id}`, {
    method: "DELETE",
    headers: buildHeaders(true),
  });
  return res.json();
};


// ---- Get total users count (admin only) ----
export const getUsersCount = async () => {
  const res = await fetch(`${BASE_URL}/api/auth/users/count`, {
    method: "GET",
    headers: buildHeaders(true),
  });
  return res.json();
};



// ENQUIRY FORM

// ---- Submit enquiry (public) ----
export const submitEnquiry = async (data: {
  name: string;
  email: string;
  message: string;
  propertyId: string;
}) => {
  const res = await fetch(`${BASE_URL}/api/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// ---- Get all enquiries (admin only) ----
export const getEnquiries = async () => {
  const res = await fetch(`${BASE_URL}/api/enquiries`, {
    method: "GET",
    headers: buildHeaders(true),
  });
  return res.json();
};

// ---- Update enquiry status (admin only) ----
export const updateEnquiryStatus = async (id: string, status: string) => {
  const res = await fetch(`${BASE_URL}/api/enquiries/${id}`, {
    method: "PUT",
    headers: buildHeaders(true),
    body: JSON.stringify({ status }),
  });
  return res.json();
};

// ---- Delete enquiry (admin only) ----
export const deleteEnquiry = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/enquiries/${id}`, {
    method: "DELETE",
    headers: buildHeaders(true),
  });
  return res.json();
};