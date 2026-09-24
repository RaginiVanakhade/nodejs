import { useEffect, useState } from "react"
import Navbar from "../component/Navbar"
import { getUserDashboardData } from "../services/datasevices"

const Dashboard = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        setLoading(true)
        setError("")

        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication required")
        }

        const response = await getUserDashboardData(token)
        setTickets(response.tickets || [])
      } catch (err) {
        setError(err.message || "Unable to fetch your tickets")
      } finally {
        setLoading(false)
      }
    }

    fetchUserTickets()
  }, [])

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Overview
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Welcome to your dashboard</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Manage support requests, track updates, and keep everything organized from one place.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">My Tickets</h2>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
              {tickets.length} total
            </span>
          </div>

          {loading ? (
            <p className="text-slate-600">Loading your tickets...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : tickets.length === 0 ? (
            <p className="text-slate-600">You do not have any tickets yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="px-4 py-3 font-semibold">Software</th>
                    <th className="px-4 py-3 font-semibold">Priority</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket._id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{ticket.softwareName || "Ticket"}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                          {ticket.priority || "Normal"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{ticket.category || "General"}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
                          {ticket.status || "OPEN"}
                        </span>
                      </td>
                      <td className="max-w-md px-4 py-3 text-slate-600">{ticket.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
