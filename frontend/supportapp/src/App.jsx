
import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from './component/auth/login'
import Register from './component/auth/register'

function App() {


  return (
    <>
  
  <BrowserRouter>
  <Routes>
    <Route path='/' element={<Login/>}/>
    <Route path='/register' element={<Register/>}/>
  </Routes>
  </BrowserRouter>

    </>
  )
}

export default App
