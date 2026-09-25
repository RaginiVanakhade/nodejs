import { useEffect, useMemo, useState } from "react"
import Navbar from "../component/Navbar"
import {  getAdminDashboardData, updateTicketStatus } from "../services/datasevices"

const ROWS_PER_PAGE = 5

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [statusComment, setStatusComment] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("OPEN")
  const [currentPage, setCurrentPage] = useState(1)

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
    

      return (
        !query ||
        userName.includes(query) ||
        email.includes(query) ||
        software.includes(query) ||
        status.includes(query) 
       
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

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / ROWS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedTickets = filteredTickets.slice(
    (safeCurrentPage - 1) * ROWS_PER_PAGE,
    safeCurrentPage * ROWS_PER_PAGE
  )

  const openTicketModal = (ticket) => {
    setSelectedTicket(ticket)
    setSelectedStatus(ticket.status || "OPEN")
    setStatusComment(ticket.closeComment || "")
    setError("")
  }

  const closeTicketModal = () => {
    setSelectedTicket(null)
    setStatusComment("")
    setSelectedStatus("OPEN")
    setError("")
  }

  const handleStatusUpdate = async (e) => {
    e.preventDefault()

    if (!selectedTicket) return

    try {
      const token = localStorage.getItem("token")
      const closeNote = statusComment.trim()

      await updateTicketStatus(selectedTicket._id, selectedStatus, token, closeNote)

      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === selectedTicket._id
            ? {
                ...ticket,
                status: selectedStatus,
                closeComment: selectedStatus === "CLOSED" ? closeNote : "",
              }
            : ticket
        )
      )

      setSelectedTicket((prev) =>
        prev
          ? {
              ...prev,
              status: selectedStatus,
              closeComment: selectedStatus === "CLOSED" ? closeNote : "",
            }
          : null
      )
      setError("")
      closeTicketModal()
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
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search user, email, software..."
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-500 focus:bg-white"
              />

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setCurrentPage(1)
                }}
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
                      <th className="px-4 py-3 font-semibold">Software Name</th>
                      <th className="px-4 py-3 font-semibold">Priority</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Comment</th>
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTickets.map((ticket) => (
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
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              (ticket.status || "OPEN") === "CLOSED"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-indigo-100 text-indigo-700"
                            }`}
                          >
                            {ticket.status || "OPEN"}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-slate-600">
                          {ticket.softwareIssueComment || "No comment"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => openTicketModal(ticket)}
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

              {filteredTickets.length > ROWS_PER_PAGE && (
                <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-4 sm:flex-row">
                  <p className="text-sm text-slate-600">
                    Page {safeCurrentPage} of {totalPages}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={safeCurrentPage === 1}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Prev
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={safeCurrentPage === totalPages}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                  <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-slate-900">Ticket Details</h3>
                      <button
                        type="button"
                        onClick={closeTicketModal}
                        className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
                      >
                        Close
                      </button>
                    </div>

                    <form className="space-y-3" onSubmit={handleStatusUpdate}>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">User</label>
                        <input
                          value={selectedTicket.createdBy?.name || "Unknown"}
                          readOnly
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
                        <input
                          value={selectedTicket.createdBy?.email || "N/A"}
                          readOnly
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
                        />
                      </div>

                      <div>
                      
                       
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-700">Software</label>
                          <input
                            value={selectedTicket.softwareName || "N/A"}
                            readOnly
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-700">Priority</label>
                          <input
                            value={selectedTicket.priority || "Normal"}
                            readOnly
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Category</label>
                        <input
                          value={selectedTicket.category || "General"}
                          readOnly
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Software Issue Comment</label>
                        <textarea
                          value={selectedTicket.softwareIssueComment || "No issue comment"}
                          readOnly
                          rows="3"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Status</label>
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 outline-none focus:border-violet-500"
                        >
                          <option value="OPEN">OPEN</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </div>

                      {selectedStatus !== "CLOSED" && (
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-700">Closing Comment</label>
                          <textarea
                            value={statusComment}
                            onChange={(e) => setStatusComment(e.target.value)}
                            rows="3"
                            placeholder="Write a closing comment here..."
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 outline-none focus:border-violet-500"
                          />
                        </div>
                      )}

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={closeTicketModal}
                          className="rounded-xl bg-slate-200 px-4 py-2 font-semibold text-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-500"
                        >
                          Update Status
                        </button>
                      </div>
                    </form>
                  </div>
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
