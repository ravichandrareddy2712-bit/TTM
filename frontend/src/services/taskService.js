import api from "../lib/axios";

export const getTasks = async (params) => (await api.get("/tasks", { params })).data;
export const createTask = async (payload) => (await api.post("/tasks", payload)).data;
export const updateTask = async (taskId, payload) => (await api.patch(`/tasks/${taskId}`, payload)).data;
export const deleteTask = async (taskId) => (await api.delete(`/tasks/${taskId}`)).data;
export const moveTask = async (taskId, status) => (await api.patch(`/tasks/${taskId}/move`, { status })).data;
export const updateTaskStatus = moveTask;
