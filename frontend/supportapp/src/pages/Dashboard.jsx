import { useEffect, useState } from "react"
import Navbar from "../component/Navbar"
import Module from "../component/module"
import {
  createTicket,
  deleteTicket,
  getUserDashboardData,
  updateTicket,
} from "../services/datasevices"
import Custombtn from "../custom/Custombtn"

const initialForm = {

  category: "",
  priority: "HIGH",
  softwareName: "",
  softwareIssueComment: "",
}

const Dashboard = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [editingTicketId, setEditingTicketId] = useState(null)

//   const fetchUserTickets = async () => {
//     try {
//       setLoading(true)
//       setError("")

//       const token = localStorage.getItem("token")
//       if (!token) {
//         throw new Error("Authentication required")
//       }

//       const response = await getUserDashboardData(token)
//       setTickets(response.tickets || [])
//     } catch (err) {
//       setError(err.message || "Unable to fetch your tickets")
//     } finally {
//       setLoading(false)
//     }
//   }

  useEffect(() => {
    let isMounted = true

    const loadTickets = async () => {
      try {
        setLoading(true)
        setError("")

        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication required")
        }

        const response = await getUserDashboardData(token)
        if (isMounted) {
          setTickets(response.tickets || [])
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to fetch your tickets")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadTickets()

    return () => {
      isMounted = false
    }
  }, [])

  const handleOpenModal = () => {
    setEditingTicketId(null)
    setFormData(initialForm)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (ticket) => {
    if (ticket.status === "CLOSED") {
      setError("This ticket is closed and cannot be edited.")
      return
    }

    setEditingTicketId(ticket._id)
    setFormData({
    
      category: ticket.category || "",
      priority: ticket.priority || "HIGH",
      softwareName: ticket.softwareName || "",
      softwareIssueComment: ticket.softwareIssueComment || "",
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTicketId(null)
    setFormData(initialForm)
  }

  const handleDeleteTicket = async (ticketId) => {
    const confirmDelete = window.confirm("Delete this ticket?")
    if (!confirmDelete) return

    try {
      const token = localStorage.getItem("token")
      await deleteTicket(ticketId, token)
      setTickets((prev) => prev.filter((ticket) => ticket._id !== ticketId))
      setError("")
    } catch (err) {
      setError(err.message || "Unable to delete ticket")
    }
  }

  const handleSubmitTicket = async (e) => {
    e.preventDefault()

    try {
      setSubmitting(true)
      setError("")

      const token = localStorage.getItem("token")

      if (editingTicketId) {
        const response = await updateTicket(editingTicketId, formData, token)

        if (response?.ticket) {
          setTickets((prev) =>
            prev.map((ticket) => (ticket._id === editingTicketId ? response.ticket : ticket))
          )
        }
      } else {
        const response = await createTicket(formData, token)

        if (response?.ticket) {
          setTickets((prev) => [response.ticket, ...prev])
        }
      }

      handleCloseModal()
    } catch (err) {
      setError(
        err.message || (editingTicketId ? "Unable to update ticket" : "Unable to create ticket")
      )
    } finally {
      setSubmitting(false)
    }
  }

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

        <div className="mt-6 flex justify-end">
          <Custombtn
            text="Request ticket"
            onClick={handleOpenModal}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500"
          />
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
                
                    <th className="px-4 py-3 font-semibold text-center">Action</th>
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
                        <div className="flex flex-col gap-1">
                          <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
                            {ticket.status || "OPEN"}
                          </span>
                          {ticket.status === "CLOSED" && (
                            <span className="rounded-md bg-emerald-100 px-2 py-1 text-[11px] font-medium text-emerald-700">
                              Close note: {ticket.closeComment || "Ticket was closed."}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {ticket.status !== "CLOSED" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(ticket)}
                                className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteTicket(ticket._id)}
                                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Module
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmitTicket}
        loading={submitting}
        title={editingTicketId ? "Edit Ticket" : "Request Ticket"}
        submitLabel={editingTicketId ? "Update Ticket" : "Submit Ticket"}
      />
    </div>
  )
}

export default Dashboard
