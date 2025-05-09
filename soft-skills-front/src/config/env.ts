export const environment = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1",
  CHATBOT_BASE_URL:
    import.meta.env.VITE_CHATBOT_BASE_URL || "http://127.0.0.1:8001",
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === "true",
};
