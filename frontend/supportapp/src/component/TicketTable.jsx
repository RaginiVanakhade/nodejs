const priorityStyles = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  LOW: "bg-emerald-100 text-emerald-700",
  default: "bg-slate-100 text-slate-700",
}

const statusStyles = {
  CLOSED: "bg-emerald-100 text-emerald-700",
  OPEN: "bg-indigo-100 text-indigo-700",
  default: "bg-slate-100 text-slate-700",
}

const TicketTable = ({ tickets = [], isAdmin = false, onEdit, onDelete, onView }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-left text-sm text-slate-700">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
            {isAdmin && <th className="px-4 py-3 font-semibold">User</th>}
            <th className="px-4 py-3 font-semibold">Software Name</th>
            <th className="px-4 py-3 font-semibold">Priority</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Comment</th>
            <th className="px-4 py-3 font-semibold text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id} className="border-b border-slate-200 hover:bg-slate-50">
              {isAdmin && (
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">
                    {ticket.createdBy?.name || "Unknown user"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {ticket.createdBy?.email || "N/A"}
                  </div>
                </td>
              )}

              <td className="px-4 py-3 font-medium text-slate-900">
                {ticket.softwareName || "Ticket"}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    priorityStyles[ticket.priority] || priorityStyles.default
                  }`}
                >
                  {ticket.priority || "Normal"}
                </span>
              </td>

              <td className="px-4 py-3">{ticket.category || "General"}</td>

              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    statusStyles[ticket.status] || statusStyles.default
                  }`}
                >
                  {ticket.status || "OPEN"}
                </span>
              </td>

              <td className="px-4 py-3 text-slate-600">
                {ticket.softwareIssueComment || "No comment"}
              </td>

              <td className="px-4 py-3 text-center">
                {isAdmin ? (
                  <button
                    type="button"
                    onClick={() => onView?.(ticket)}
                    className="rounded-lg bg-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-300"
                  >
                    View
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    {ticket.status !== "CLOSED" && (
                      <>
                        <button
                          type="button"
                          onClick={() => onEdit?.(ticket)}
                          className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete?.(ticket._id)}
                          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TicketTable