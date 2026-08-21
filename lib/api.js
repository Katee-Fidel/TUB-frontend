const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Thin fetch wrapper that:
 * - always sends cookies (credentials: "include") so the httpOnly JWT cookies work
 * - on a 401, tries /auth/refresh once and retries the original request
 * - throws a normal Error with the server's message on failure
 */
async function request(path, options = {}, isRetry = false) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (res.status === 401 && !isRetry && path !== "/api/auth/refresh") {
    const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshRes.ok) {
      return request(path, options, true); // retry original request once
    }
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}


async function requestMultipart(path, method, formData, isRetry = false) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    body: formData, // no Content-Type header — browser sets it with the boundary
  });

  if (res.status === 401 && !isRetry) {
    const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshRes.ok) {
      return requestMultipart(path, method, formData, true);
    }
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// Builds a FormData object from a plain event fields object + optional File
function buildEventFormData(fields, bannerFile) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });
  if (bannerFile) formData.append("banner", bannerFile);
  return formData;
}

export const api = {
  register: (payload) =>
    request("/api/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  me: () => request("/api/auth/me", { method: "GET" }),

  // Events
  getPublicEvents: () => request("/api/events", { method: "GET" }),
  getMyEvents: () => request("/api/events/mine", { method: "GET" }),
  getEvent: (id) => request(`/api/events/${id}`, { method: "GET" }),
  createEvent: (fields, bannerFile) =>
    requestMultipart("/api/events", "POST", buildEventFormData(fields, bannerFile)),
  updateEvent: (id, fields, bannerFile) =>
    requestMultipart(`/api/events/${id}`, "PATCH", buildEventFormData(fields, bannerFile)),
  deleteEvent: (id) => request(`/api/events/${id}`, { method: "DELETE" }),
};