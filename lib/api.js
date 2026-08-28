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
    if (refreshRes.ok) return request(path, options, true);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

async function requestMultipart(path, method, formData, isRetry = false) {
  const res = await fetch(`${API_URL}${path}`, { method, credentials: "include", body: formData });
  if (res.status === 401 && !isRetry) {
    const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, { method: "POST", credentials: "include" });
    if (refreshRes.ok) return requestMultipart(path, method, formData, true);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

function buildEventFormData(fields, bannerFile) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") formData.append(key, value);
  });
  if (bannerFile) formData.append("banner", bannerFile);
  return formData;
}

export const api = {
  register: (payload) => request("/api/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/api/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  me: () => request("/api/auth/me", { method: "GET" }),

  getPublicEvents: () => request("/api/events", { method: "GET" }),
  getMyEvents: () => request("/api/events/mine", { method: "GET" }),
  getEvent: (id) => request(`/api/events/${id}`, { method: "GET" }),
  getEventAnalytics: (id) => request(`/api/events/${id}/analytics`, { method: "GET" }),
  createEvent: (fields, bannerFile) => requestMultipart("/api/events", "POST", buildEventFormData(fields, bannerFile)),
  updateEvent: (id, fields, bannerFile) => requestMultipart(`/api/events/${id}`, "PATCH", buildEventFormData(fields, bannerFile)),
  deleteEvent: (id) => request(`/api/events/${id}`, { method: "DELETE" }),

  getWallet: () => request("/api/wallet", { method: "GET" }),
  topupWallet: (amount, phone) => request("/api/wallet/topup", {method: "POST", body: JSON.stringify({amount, phone})}),
  getTopupStatus: (checkoutRequestID) => request(`/api/wallet/topup/${checkoutRequestID}/status`, {method: "GET"}),

  purchaseTicket: (eventId, payload) => request(`/api/events/${eventId}/purchase`, {method: "POST", body: JSON.stringify(payload)}),
  getMyTickets: () => request("/api/tickets/mine", {method:"GET"}),
  getTicketStatus: (ticketId) => request(`/api/tickets/${ticketId}/status`, {method: "GET"}),
  validateTicket: (token) => request("/api/tickets/validate", { method: "POST", body: JSON.stringify({ token }) }),

  getPosts: () => request("/api/posts", { method: "GET" }),
  createPost: (caption, image) => { const formData = new FormData(); formData.append("caption", caption); formData.append("image", image); return requestMultipart("/api/posts", "POST", formData); },
  togglePostLike: (id) => request(`/api/posts/${id}/like`, { method: "POST" }),
  addPostComment: (id, text) => request(`/api/posts/${id}/comments`, { method: "POST", body: JSON.stringify({ text }) }),
  updatePost: (id, caption, image) => { const formData = new FormData(); formData.append("caption", caption); if (image) formData.append("image", image); return requestMultipart(`/api/posts/${id}`, "PATCH", formData); },
  deletePost: (id) => request(`/api/posts/${id}`, { method: "DELETE" }),
  updateProfile: (name, avatar) => { const formData = new FormData(); formData.append("name", name); if (avatar) formData.append("avatar", avatar); return requestMultipart("/api/users/me", "PATCH", formData); },
  getUserProfile: (id) => request(`/api/users/${id}`, { method: "GET" }),
};
