
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from './component/auth/Login'
import Register from './component/auth/register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import { getAuthState } from "./utils/auth"

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
