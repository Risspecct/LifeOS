let unread = null;

export const initUnreadCount = (count) => {
  unread = Number.isFinite(count) ? Number(count) : 0;
  return unread;
};

export const getUnreadCountLocal = () => unread;

export const setUnreadCountLocal = (count) => {
  unread = Math.max(0, Number.isFinite(count) ? Number(count) : 0);
  return unread;
};

export const incrementUnreadLocal = (by = 1) => {
  unread = (unread ?? 0) + Number(by);
  return unread;
};

export const decrementUnreadLocal = (by = 1) => {
  unread = Math.max(0, (unread ?? 0) - Number(by));
  return unread;
};

export const clearUnreadLocal = () => {
  unread = 0;
};

export default {
  initUnreadCount,
  getUnreadCountLocal,
  setUnreadCountLocal,
  incrementUnreadLocal,
  decrementUnreadLocal,
  clearUnreadLocal,
};
