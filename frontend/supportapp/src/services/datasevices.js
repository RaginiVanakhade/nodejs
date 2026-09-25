import {
  base_url,
  adminData,
  userData,
  createTickit,
  updateTickit,
  deleteTickit,
} from "./apiendpoint"

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

export const updateTicketStatus = async (ticketId, status, token, closeComment = "") => {
  const response = await fetch(`${base_url}/api/tickets/${ticketId}/status`, {
    method: "PATCH",
    headers: getAuthHeader(token),
    body: JSON.stringify({ status, closeComment }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || "Failed to update ticket status")
  }

  return data
}

export const deleteTicket = async (ticketId, token) => {
  const response = await fetch(`${base_url}${deleteTickit.replace(":id", ticketId)}`, {
    method: "DELETE",
    headers: getAuthHeader(token),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete ticket")
  }

  return data
}

export const createTicket = async (payload, token) => {
  const response = await fetch(`${base_url}${createTickit}`, {
    method: "POST",
    headers: getAuthHeader(token),
    body: JSON.stringify({
      description: payload.description,
      category: payload.category,
      priority: payload.priority,
      softwareName: payload.softwareName,
      softwareIssueComment: payload.softwareIssueComment,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || "Failed to create ticket")
  }

  return data
}

export const updateTicket = async (ticketId, payload, token) => {
  const response = await fetch(`${base_url}${updateTickit.replace(":id", ticketId)}`, {
    method: "PUT",
    headers: getAuthHeader(token),
    body: JSON.stringify({
      description: payload.description,
      category: payload.category,
      priority: payload.priority,
      softwareName: payload.softwareName,
      softwareIssueComment: payload.softwareIssueComment,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || "Failed to update ticket")
  }

  return data
}