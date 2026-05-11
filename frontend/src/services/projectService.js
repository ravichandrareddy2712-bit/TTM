import api from "../lib/axios";

export const getProjects = async () => (await api.get("/projects")).data;
export const createProject = async (payload) => (await api.post("/projects", payload)).data;
export const updateProjectMembers = async (projectId, members) =>
  (await api.patch(`/projects/${projectId}/members`, { members })).data;
