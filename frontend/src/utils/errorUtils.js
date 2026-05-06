export const getApiErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  const data = error?.response?.data;

  if (!data) {
    // Usually network/backend-down/CORS-level failure.
    if (error?.message) {
      return `Request failed before reaching backend: ${error.message}`;
    }
    return fallback;
  }

  if (typeof data === "string") return data;
  if (typeof data.message === "string" && data.message.trim()) return data.message;

  if (typeof data === "object") {
    const firstValue = Object.values(data).find((value) => typeof value === "string" && value.trim());
    if (firstValue) return firstValue;
  }

  return fallback;
};
