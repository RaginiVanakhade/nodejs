export const base_url = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3001").replace(/\/+$/, "")
export const LoginEndPoint = "/api/auth/login"
export const registerEndPoint = "/api/user"

// admin endpoints 
export const adminData = "/api/tickets/all"


// user endpoints 
export const createTickit = "/api/tickets"
export const userData = "/api/tickets/my-tickets"
export const updateTickit = "/api/tickets/:id"