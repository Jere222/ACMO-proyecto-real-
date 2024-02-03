import styles from './Admin.module.scss'
import {Link, useNavigate} from 'react-router-dom'
import { IsAdminContext } from '../../contexts/isAdminContext'
import { useContext, useEffect } from 'react'
import { saveAs } from 'file-saver'
import { collection, getDocs } from 'firebase/firestore'
import db from '../../../db/firebase-config'

const Admin = () => {

  const {isAdmin} = useContext(IsAdminContext)
  const navigate = useNavigate()
  
  const descargarCopia = async() => {
    const sociosRef = collection(db, "Socios")
    const sociosCollection = await getDocs(sociosRef)
    const socios = sociosCollection.docs.map(doc => ({...doc.data(), "id": doc.id}) )
    const sociosTxt = JSON.stringify(socios)
    const blob = new Blob([sociosTxt], {type: 'text/plain;charset=utf-8'})
    saveAs(blob, 'copia_seguridad.txt') 
  }

  useEffect(() => {
    //Mandar a iniciar sesion si no es el admin
    if(isAdmin){
      navigate('/admin/auth')
    }
  }, [])
  
  return (
    <div className={styles.admin}>
        <Link to='/admin/socios/1'>Socios</Link>
        <Link to='/admin/cumpleaneros/1'>Cumpleañeros</Link>
        <Link to='/admin/nuevos/1'>Nuevos socios</Link>
        <Link onClick={descargarCopia}>Descargar copia de seguridad</Link>
    </div>
  )
}

export default Admin