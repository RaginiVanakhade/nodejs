import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../../services/authServices"
import CustomBtn from "../../custom/Custombtn"
const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await loginUser(formData)
      const userRole = response?.user?.role || JSON.parse(atob((response.token || '').split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))?.role

      if (!response?.token || !userRole) {
        throw new Error("Login failed. Invalid token or role.")
      }

      alert(response.message || "Login successful")
      localStorage.setItem("token", response.token)
      localStorage.setItem("role", userRole)

      if (userRole === "admin") {
        navigate("/admindashboard")
        return
      }

      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-50 p-6">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white/80 p-8 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-indigo-700">
            Welcome back
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Login</h2>
          <p className="mt-2 text-sm text-slate-500">Access your support dashboard</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
              required
            />
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <CustomBtn
            type="submit"
            disabled={loading}
           text= {loading ? "Logging in..." : "Login"}
            className="w-full rounded-2xl cursor-pointer bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-200 disabled:cursor-not-allowed disabled:opacity-70"
          />
           
          
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don’t have an account?{' '}
          <CustomBtn
            type="button"
            className="font-semibold text-indigo-600 transition hover:text-indigo-700 cursor-pointer"
            onClick={() => navigate("/register")}
            text="Register here"
          />
        </p>
      </div>
    </div>
  )
}

export default Login
