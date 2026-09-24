import { base_url, adminData, userData } from "./apiendpoint"

const getAuthHeader = (token) => {
  if (!token) {
    throw new Error("Authentication required")
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export const getAdminDashboardData = async (token) => {
  const response = await fetch(`${base_url}${adminData}`, {
    method: "GET",
    headers: getAuthHeader(token),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || "Failed to load admin data")
  }

  return data
}

export const getUserDashboardData = async (token) => {
  const response = await fetch(`${base_url}${userData}`, {
    method: "GET",
    headers: getAuthHeader(token),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || "Failed to load user data")
  }

  return data
}

export const updateTicketStatus = async (ticketId, status, token) => {
  const response = await fetch(`${base_url}/api/tickets/${ticketId}/status`, {
    method: "PATCH",
    headers: getAuthHeader(token),
    body: JSON.stringify({ status }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || "Failed to update ticket status")
  }

  return data
}

export const deleteTicket = async (ticketId, token) => {
  const response = await fetch(`${base_url}/api/tickets/${ticketId}`, {
    method: "DELETE",
    headers: getAuthHeader(token),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete ticket")
  }

  return data
}