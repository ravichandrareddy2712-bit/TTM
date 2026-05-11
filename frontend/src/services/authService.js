import api from "../lib/axios";

export const signupUser = async (payload) => (await api.post("/auth/signup", payload)).data;
export const loginUser = async (payload) => (await api.post("/auth/login", payload)).data;
export const getMe = async () => (await api.get("/auth/me")).data;
