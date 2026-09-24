
import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from './component/auth/login'

function App() {


  return (
    <>
  
  <BrowserRouter>
  <Routes>
    <Route path='/' element={<Login/>}/>
    <Route path='/about' element="about page"/>
  </Routes>
  </BrowserRouter>

    </>
  )
}

export default App
