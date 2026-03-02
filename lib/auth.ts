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
    if (error.response?.status === 401) {
      try {
        const res = await api.post("/auth/refresh");
        setAccessToken(res.data.accessToken);

        error.config.headers.Authorization =
          "Bearer " + res.data.accessToken;

        return api(error.config);
      } catch {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);