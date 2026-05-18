import api from "./axios";

const unwrap = (res) => res.data?.data ?? res.data;

export const authApi = {
  register: (formData) =>
    api.post("/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  login: (body) => api.post("/users/login", body),
  logout: () => api.post("/users/logout"),
  me: () => unwrap(api.get("/users/me")),
};

export const portfolioApi = {
  get: () => unwrap(api.get("/portfolio")),
  update: (body) => unwrap(api.patch("/portfolio", body)),
  addHolding: (body) => unwrap(api.post("/portfolio/holdings", body)),
  updateHolding: (coinId, body) =>
    unwrap(api.patch(`/portfolio/holdings/${coinId}`, body)),
  removeHolding: (coinId) =>
    unwrap(api.delete(`/portfolio/holdings/${coinId}`)),
  analysis: () => unwrap(api.get("/portfolio/analysis")),
};

export const watchlistApi = {
  get: () => unwrap(api.get("/watchlist")),
  add: (body) => unwrap(api.post("/watchlist", body)),
  remove: (cryptoId) => unwrap(api.delete(`/watchlist/${cryptoId}`)),
  markets: () => unwrap(api.get("/watchlist/markets")),
};

export const alertsApi = {
  get: () => unwrap(api.get("/alerts")),
  create: (body) => unwrap(api.post("/alerts", body)),
  update: (id, body) => unwrap(api.patch(`/alerts/${id}`, body)),
  remove: (id) => unwrap(api.delete(`/alerts/${id}`)),
  triggered: () => unwrap(api.get("/alerts/triggered")),
};

export const cryptoApi = {
  markets: (page = 1, perPage = 50) =>
    unwrap(api.get("/crypto/markets", { params: { page, perPage } })),
  search: (q) => unwrap(api.get("/crypto/search", { params: { q } })),
  trending: () => unwrap(api.get("/crypto/trending")),
  getCoin: (id) => unwrap(api.get(`/crypto/${id}`)),
  prices: (ids) =>
    unwrap(api.get("/crypto/prices", { params: { ids: ids.join(",") } })),
};
