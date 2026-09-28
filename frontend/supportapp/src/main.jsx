import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

const theme = createTheme({
  palette: {
    primary: { main: "#6366f1" },   // indigo-500
    secondary: { main: "#8b5cf6" }, // violet-500
    error: { main: "#ef4444" },
    warning: { main: "#f59e0b" },
    success: { main: "#10b981" },
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: "inherit" },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
       <CssBaseline />
    <App />
    </ThemeProvider>
  </StrictMode>,
)
