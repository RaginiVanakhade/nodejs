export const base_url = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3001").replace(/\/+$/, "")
export const LoginEndPoint = "/api/auth/login"
export const registerEndPoint = "/api/user"
export const adminData = "/api/tickets/all"