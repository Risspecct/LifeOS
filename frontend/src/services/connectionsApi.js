import apiClient from "../api/axiosClient";

const normalizeDiscoverUser = (user) => {
  if (!user || typeof user !== "object") return user;
  const resolvedId = user.id ?? user.userId;
  return {
    ...user,
    id: resolvedId
  };
};

export const getFriends = async () => {
  const response = await apiClient.get("/friends");
  return Array.isArray(response?.data) ? response.data : [];
};

export const removeFriend = async (friendId) => {
  const response = await apiClient.delete(`/friends/${friendId}`);
  return response.data;
};

export const getIncomingRequests = async () => {
  const response = await apiClient.get("/friends/requests/incoming");
  return Array.isArray(response?.data) ? response.data : [];
};

export const getOutgoingRequests = async () => {
  const response = await apiClient.get("/friends/requests/outgoing");
  return Array.isArray(response?.data) ? response.data : [];
};

export const sendFriendRequest = async (receiverId) => {
  const numericReceiverId = Number(receiverId);
  if (!Number.isFinite(numericReceiverId) || numericReceiverId <= 0) {
    throw new Error("Invalid receiver id for friend request.");
  }
  const response = await apiClient.post(`/friends/request/${numericReceiverId}`);
  return response.data;
};

export const acceptFriendRequest = async (requestId) => {
  const response = await apiClient.post(`/friends/request/${requestId}/accept`);
  return response.data;
};

export const rejectFriendRequest = async (requestId) => {
  const response = await apiClient.post(`/friends/request/${requestId}/reject`);
  return response.data;
};

export const getDiscoverUsers = async () => {
  const response = await apiClient.get("/profile/all");
  return Array.isArray(response?.data) ? response.data.map(normalizeDiscoverUser) : [];
};

export const searchDiscoverUsers = async (query) => {
  const response = await apiClient.get("/profile/search", { params: { q: query } });
  return Array.isArray(response?.data) ? response.data.map(normalizeDiscoverUser) : [];
};
