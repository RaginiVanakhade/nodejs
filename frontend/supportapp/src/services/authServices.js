import { base_url, LoginEndPoint, registerEndPoint } from "./apiendpoint"

export const registerUser = async ({ name, email, password }) => {
  const response = await fetch(`${base_url}${registerEndPoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || "Registration failed")
  }

  return data
}

export const loginUser = async ({ email, password }) => {
  const response = await fetch(`${base_url}${LoginEndPoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || "Login failed")
  }

  return data
}