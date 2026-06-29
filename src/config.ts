// Base URL of the Node.js admin backend. Override in a .env file with
// VITE_API_BASE_URL=https://your-api.com/api
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
