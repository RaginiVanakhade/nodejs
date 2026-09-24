
import {useNavigate } from "react-router-dom"
const Register = () => {
    const navigate = useNavigate()
  return (
         <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <form className="bg-white p-8 rounded-xl shadow-lg w-96 space-y-5">
    
    <h2 className="text-2xl font-bold text-center text-gray-800">
      Register Form
    </h2>

    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
        Name
      </label>
      <input
        type="text"
        id="name"
        name="name"
        placeholder="Enter your name"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>


    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
        Email
      </label>
      <input
        type="email"
        id="email"
        name="email"
        placeholder="Enter your email"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
        Password
      </label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Enter your password"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

   <div className="text-center text-gray-600">
  Already have an account ?{" "}
  <span className="text-blue-400 hover:text-blue-600 cursor-pointer font-medium" onClick={() => navigate("/")}>
    login here
  </span>
  </div>
    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Register Here
    </button>

  </form>

    </div>
  )
}

export default Register
