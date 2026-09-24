
import { NavLink, useNavigate } from "react-router-dom"

const Navbar = () => {
  const navigate = useNavigate()

  const handleSignOut = () => {
    localStorage.removeItem("token")

    localStorage.removeItem("role")
    navigate("/")
  }

  return (
    <nav className="border-b border-slate-200 bg-slate-900 text-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">
            SD
          </div>
          <div>
            <p className="text-lg font-bold tracking-wide">Support Desk</p>
           
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `rounded-full px-3 py-2 text-sm font-medium transition ${
                isActive ? "bg-indigo-500 text-white" : "text-slate-200 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            Dashboard
          </NavLink>

          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
