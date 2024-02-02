import styles from './Login.module.scss'
import db from '../../../db/firebase-config'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState, useContext } from 'react'
import { IsAdminContext } from '../../contexts/isAdminContext'
import { useNavigate } from 'react-router-dom'


const Login = () => {
  const [admin, setAdmin] = useState({})
  const [inputUser, setInputUser] = useState("")
  const [inputClave, setinputClave] = useState("")  
  const adminRef = doc(db, "Admin","sxEHi9I5NmhDigMWCMSA")
  const {getIsAdmin} = useContext(IsAdminContext)
  const navigate = useNavigate()

  const getAdmin = async() =>{
    const docAdmin = await getDoc(adminRef)
    const admin = docAdmin.data()
    setAdmin(admin)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if((admin.usuario == inputUser)&&(admin.contrasena == inputClave)){
      getIsAdmin()
      navigate('/admin')
    }
  }
  
  useEffect(() => {
    getAdmin()
  }, [])

  return (
    <form className={styles.login} onSubmit={handleSubmit}>
      <div><p>Usuario:</p><input type="text" onChange={(e) =>setInputUser(e.target.value)} value={inputUser}/></div>
      <div><p>Contraseña:</p><input type="text" onChange={(e) =>setinputClave(e.target.value)} value={inputClave}/></div>
      <input className={styles.btn} type="submit" value="ingresar" />
    </form>
  )
}

export default Login