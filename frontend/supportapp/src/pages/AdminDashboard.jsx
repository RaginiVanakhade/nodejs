import { useEffect, useMemo, useState } from "react"
import Navbar from "../component/Navbar"
import {  getAdminDashboardData, updateTicketStatus } from "../services/datasevices"

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedTicket, setSelectedTicket] = useState(null)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true)
        setError("")

        const token = localStorage.getItem("token")
        const response = await getAdminDashboardData(token)
        setTickets(response.tickets || [])
      } catch (err) {
        setError(err.message || "Unable to fetch admin data")
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  const filteredTickets = useMemo(() => {
    const query = searchTerm.toLowerCase().trim()

    const filtered = tickets.filter((ticket) => {
      const userName = ticket.createdBy?.name?.toLowerCase() || ""
      const email = ticket.createdBy?.email?.toLowerCase() || ""
      const software = (ticket.softwareName || "").toLowerCase()
      const status = (ticket.status || "OPEN").toLowerCase()
      const description = (ticket.description || "").toLowerCase()

      return (
        !query ||
        userName.includes(query) ||
        email.includes(query) ||
        software.includes(query) ||
        status.includes(query) ||
        description.includes(query)
      )
    })

    return [...filtered].sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 }
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
      }

      if (sortBy === "status") {
        return (a.status || "OPEN").localeCompare(b.status || "OPEN")
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    })
  }, [searchTerm, sortBy, tickets])

  const handleStatusChange = async (ticketId, nextStatus) => {
    try {
      const token = localStorage.getItem("token")
      await updateTicketStatus(ticketId, nextStatus, token)
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === ticketId ? { ...ticket, status: nextStatus } : ticket
        )
      )

      setSelectedTicket((prev) =>
        prev && prev._id === ticketId ? { ...prev, status: nextStatus } : prev
      )
    } catch (err) {
      setError(err.message || "Unable to update ticket status")
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
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
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold text-slate-900">All Tickets</h2>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search user, email, software..."
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-500 focus:bg-white"
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-500 focus:bg-white"
              >
                <option value="newest">Newest</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="text-slate-600">Loading tickets...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : filteredTickets.length === 0 ? (
            <p className="text-slate-600">No tickets found.</p>
          ) : (
            <>
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
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((ticket) => (
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
                          <select
                            value={ticket.status || "OPEN"}
                            onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-indigo-700 outline-none focus:border-violet-500"
                          >
                            <option value="OPEN">OPEN</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        </td>
                        <td className="max-w-md px-4 py-3 text-slate-600">{ticket.description}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedTicket(ticket)}
                              className="rounded-lg bg-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300"
                            >
                              View
                            </button>
                          
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedTicket && (
                <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-slate-900">Ticket Details</h3>
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(null)}
                      className="text-sm font-semibold text-violet-700"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                    <div><span className="font-semibold">User:</span> {selectedTicket.createdBy?.name || "Unknown"}</div>
                    <div><span className="font-semibold">Email:</span> {selectedTicket.createdBy?.email || "N/A"}</div>
                    <div><span className="font-semibold">Software:</span> {selectedTicket.softwareName || "N/A"}</div>
                    <div><span className="font-semibold">Priority:</span> {selectedTicket.priority || "Normal"}</div>
                    <div><span className="font-semibold">Category:</span> {selectedTicket.category || "General"}</div>
                    <div><span className="font-semibold">Status:</span> {selectedTicket.status || "OPEN"}</div>
                  </div>
                  <p className="mt-3 text-sm text-slate-700">
                    <span className="font-semibold">Description:</span> {selectedTicket.description || "No description provided"}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
