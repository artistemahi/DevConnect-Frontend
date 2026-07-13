// Falls back to localhost in development if VITE_BASE_URL is not set
export const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:3000";