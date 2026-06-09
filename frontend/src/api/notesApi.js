import apiClient from "./axiosClient";

export const getNotes = async () => {
  const response = await apiClient.get("/api/notes");
  return response.data;
};

export const getTaskNotes = async (taskId) => {
  const response = await apiClient.get(`/api/notes/tasks/${taskId}/notes`);
  return response.data;
};

export const getNoteById = async (noteId) => {
  const response = await apiClient.get(`/api/notes/${noteId}`);
  return response.data;
};

export const createNote = async (payload) => {
  const response = await apiClient.post("/api/notes", payload);
  return response.data;
};

export const updateNote = async (payload) => {
  const response = await apiClient.put("/api/notes", payload);
  return response.data;
};

export const deleteNote = async (noteId) => {
  const response = await apiClient.delete(`/api/notes/${noteId}`);
  return response.data;
};
