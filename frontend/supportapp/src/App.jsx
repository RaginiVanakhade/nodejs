
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from './component/auth/Login'
import Register from './component/auth/register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'

const decodeToken = (token) => {
  if (!token) return null

  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    )

    return JSON.parse(jsonPayload)
  } catch (error) {
    console.log(error)
    return null
  }
}

const getAuthState = () => {
  const token = localStorage.getItem('token')
  if (!token) return { isAuthenticated: false, role: null }

  const payload = decodeToken(token)
  if (!payload) {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    return { isAuthenticated: false, role: null }
  }

  const isValid = !payload.exp || Date.now() < payload.exp * 1000
  if (!isValid) {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    return { isAuthenticated: false, role: null }
  }

  const userRole = payload.role || localStorage.getItem('role')
  return { isAuthenticated: true, role: userRole }
}

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, role: currentRole } = getAuthState()

  if (!isAuthenticated) {
    return <Navigate to='/' replace />
  }

  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    return <Navigate to={currentRole === 'admin' ? '/admindashboard' : '/dashboard'} replace />
  }

  return children
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated, role: currentRole } = getAuthState()

  if (isAuthenticated) {
    return <Navigate to={currentRole === 'admin' ? '/admindashboard' : '/dashboard'} replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
        <Route path='/dashboard' element={<ProtectedRoute allowedRoles={['employee']}><Dashboard /></ProtectedRoute>} />
        <Route path='/admindashboard' element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
