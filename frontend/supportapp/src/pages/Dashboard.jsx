import { useState } from "react"
import Navbar from "../component/Navbar"
import Module from "../component/Module"
import { createTicket, deleteTicket, updateTicket } from "../services/datasevices"
import Custombtn from "../custom/Custombtn"
import useTickets from "../hooks/useTickets"
import TicketTable from "../component/TicketTable"

const getTicketFormData = (ticket = {}) => ({
  category: ticket.category || "",
  priority: ticket.priority || "HIGH",
  softwareName: ticket.softwareName || "",
  softwareIssueComment: ticket.softwareIssueComment || "",
})

const initialForm = getTicketFormData()

const Dashboard = () => {
  const { tickets, setTickets, loading, error, setError } = useTickets()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [editingTicketId, setEditingTicketId] = useState(null)

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
    setFormData(getTicketFormData(ticket))
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTicketId(null)
    setFormData(initialForm)
  }

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm("Delete this ticket?")) return
    try {
      const token = localStorage.getItem("token")
      await deleteTicket(ticketId, token)
      setTickets((prev) => prev.filter((t) => t._id !== ticketId))
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
            prev.map((t) => (t._id === editingTicketId ? response.ticket : t))
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
        err.message ||
          (editingTicketId ? "Unable to update ticket" : "Unable to create ticket")
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
          <h1 className="text-3xl font-bold text-slate-900">Welcome to your dashboard😎</h1>
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
            <TicketTable
              tickets={tickets}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTicket}
            />
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