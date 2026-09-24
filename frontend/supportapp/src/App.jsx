
import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom"


function App() {

  return (
    <>
  <BrowserRouter>
  <Routes>
    <Route path='/' element="home page"/>
    <Route path='/about' element="about page"/>
  </Routes>
  </BrowserRouter>

    </>
  )
}

export default App
