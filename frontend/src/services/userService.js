import api from "../lib/axios";

export const getUsers = async () => (await api.get("/users")).data;
export const getMyTasks = async () => (await api.get("/users/me/tasks")).data;
