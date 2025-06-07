import api from "./axios";

export const register = (data) => api.post("users/register/", data);

export const login = (credentials) => api.post("users/login/", credentials);

export const refreshToken = () =>
  api.post("users/refresh/", { refresh: localStorage.getItem("refresh") });

export const getProfile = () => api.get("users/me/");

export const updateProfile = (data) => api.put("users/me/", data);

export const activateUser = (token) => api.get(`users/activate/${token}/`);

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

// 📱 Отправка SMS-кода
export const sendVerificationCode = (phone) =>
  api.post("users/send-code/", { phone });

// ✅ Подтверждение SMS-кода
export const verifyPhoneCode = (phone, code) =>
  api.post("users/verify-code/", { phone, code });
