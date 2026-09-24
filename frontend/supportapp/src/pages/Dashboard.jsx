import Navbar from "../component/Navbar"

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Overview
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Welcome to your dashboard</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Manage support requests, track updates, and keep everything organized from one place.
          </p>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
