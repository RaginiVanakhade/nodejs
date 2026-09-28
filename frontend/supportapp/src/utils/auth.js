// src/utils/auth.js


export const decodeToken = (token) => {
  if (!token) return null
  try {
    const parts = token.split(".")
    if (parts.length < 2) return null
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
   
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4)
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}


export const getAuthState = () => {
  const token = localStorage.getItem("token")
  if (!token) return { isAuthenticated: false, role: null }

  const payload = decodeToken(token)

 
  if (!payload || (payload.exp && Date.now() >= payload.exp * 1000)) {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    return { isAuthenticated: false, role: null }
  }

  const role = payload.role || localStorage.getItem("role")
  return { isAuthenticated: true, role }
}


export const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("role")
}