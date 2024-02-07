import './App.scss'
import { Route, Routes } from "react-router-dom"
import Formulario from './components/Formulario'
import ItemListContainer from './components/itemListContainer'
import Admin from './components/Admin'
import Login from './components/Login'
import Navbar from './components/Navbar'
import Home from './components/Home'
import {IsAdminProvider} from "./contexts/isAdminContext";

function App() {
  
  return (
      <div className='container'>
        <Navbar />
        <IsAdminProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/socios/formulario' element={<Formulario/>} />
              <Route path='/admin' element={<Admin />} />
              <Route path='/admin/auth' element={<Login />}/>
              <Route path='/admin/:tarea/:pag' element={<ItemListContainer />} />
              <Route path='/admin/socio/:id' element={<Formulario />} />
          </Routes>
        </IsAdminProvider>
        
      </div>
    
  )
}

export default App
