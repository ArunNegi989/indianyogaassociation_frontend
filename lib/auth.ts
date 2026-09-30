import api from "./api";

let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ Never retry refresh calls
    if (originalRequest?.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await api.post("/auth/refresh");
        setAccessToken(res.data.accessToken);
        originalRequest.headers.Authorization =
          "Bearer " + res.data.accessToken;
        return api(originalRequest);
      } catch {
        window.location.href = "/auth/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
