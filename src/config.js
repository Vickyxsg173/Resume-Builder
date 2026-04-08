// Automatically uses the production URL in production, localhost in development
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export default API_BASE_URL;
