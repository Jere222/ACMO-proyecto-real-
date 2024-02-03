import './App.scss'
import { Route, Routes } from "react-router-dom"
import Formulario from './components/Formulario'
import ItemListContainer from './components/itemListContainer'
import Admin from './components/Admin'
import Login from './components/Login'
import {IsAdminProvider} from "./contexts/isAdminContext";

function App() {
  
  return (
      <div className='container'>
        <nav>
          <img src="https://i.ibb.co/BHD8VYb/escudo.jpg" alt="logo ACMO" />
          <h1>ACMO</h1>
        </nav>
        <IsAdminProvider>
          <Routes>
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
