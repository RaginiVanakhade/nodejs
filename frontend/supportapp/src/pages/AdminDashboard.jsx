import { useEffect, useState } from "react"
import Navbar from "../component/Navbar"
import { getAdminDashboardData } from "../services/datasevices"

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await getAdminDashboardData()
        setTickets(response.tickets || [])
      } catch (err) {
        setError(err.message || "Unable to fetch admin data")
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
            Admin Overview
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Welcome to the admin dashboard</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Review tickets, manage team activity, and monitor support performance from one place.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">All Tickets</h2>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
              {tickets.length} total
            </span>
          </div>

          {loading ? (
            <p className="text-slate-600">Loading tickets...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : tickets.length === 0 ? (
            <p className="text-slate-600">No tickets found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="px-4 py-3 font-semibold">User</th>
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
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{ticket.createdBy?.name || "Unknown user"}</div>
                        <div className="text-xs text-slate-500">{ticket.createdBy?.email || "N/A"}</div>
                      </td>
                      <td className="px-4 py-3">{ticket.softwareName || "Ticket"}</td>
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
                      <td className="px-4 py-3 max-w-md">{ticket.description}</td>
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

export default AdminDashboard
