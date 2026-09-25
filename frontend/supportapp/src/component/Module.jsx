const Module = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  loading,
  title = "Request Ticket",
  submitLabel = "Submit Ticket",
}) => {
  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.()
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-[fadeIn_0.2s_ease-out]">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
          >
            Close
          </button>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
              placeholder="Example: Login issue"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                required
              >
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Software Name</label>
              <input
                type="text"
                name="softwareName"
                value={formData.softwareName}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                placeholder="Example: ERP System"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Software Issue Comment</label>
            <textarea
              name="softwareIssueComment"
              value={formData.softwareIssueComment}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
              placeholder="Add additional notes about the issue"
              required
            />
          </div>

          {/* <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Remark</label>
            <textarea
              name="remark"
              value={formData.remark || ""}
              onChange={handleChange}
              rows="2"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
              placeholder="Add any internal remark or note"
            />
          </div> */}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-200 px-4 py-2 font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Submitting..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Module

