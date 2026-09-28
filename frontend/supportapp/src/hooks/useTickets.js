import { useEffect, useState } from "react"
import { getUserDashboardData } from "../services/datasevices"

const useTickets = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isMounted = true

    const loadTickets = async () => {
      try {
        setLoading(true)
        setError("")

        const token = localStorage.getItem("token")
        if (!token) throw new Error("Authentication required")

        const response = await getUserDashboardData(token)
        if (!isMounted) return
        setTickets(response.tickets || [])
      } catch (err) {
        if (!isMounted) return
        setError(err.message || "Unable to fetch tickets")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadTickets()
    return () => {
      isMounted = false
    }
  }, [])

  return { tickets, setTickets, loading, error, setError }
}

export default useTickets