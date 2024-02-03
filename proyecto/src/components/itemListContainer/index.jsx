import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import styles from './ItemListContainer.module.scss'
import db from '../../../db/firebase-config'
import { useContext, useEffect, useState } from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import Card from '../Card'
import { IsAdminContext } from '../../contexts/isAdminContext'
import {FaMagnifyingGlass} from 'react-icons/fa6'

const ItemListContainer = () => {
  const {isAdmin} = useContext(IsAdminContext)
  const {tarea, pag} = useParams()
  const nroPag = parseInt(pag)
  const [inputBuscar, setInputBuscar] = useState("")
  const [socios, setSocios] = useState([])
  const [cambioSocios, setCambioSocios] = useState(true)
  const [cantPag, setCantPag] = useState([])
  const sociosRef = collection(db, "Socios")
  const sociosQuery = query(sociosRef, orderBy("apellido", "asc"))
  const buscar = (tarea=="socios")? <div className={styles.buscarSocios}><FaMagnifyingGlass/><input  type="text"  onChange={(e) =>setInputBuscar(e.target.value)} value={inputBuscar}/></div> : undefined
  const navigate = useNavigate()
  

  
  // Traer socios
  const getSocios = async() => {
    const sociosCollection = await getDocs(sociosQuery)
    let socios = sociosCollection.docs.map(doc => ({...doc.data(), "id": doc.id}) )
    // Ordenar alfabeticamente por nombre a los socios de igual apellido
    for (let i = 0; i < socios.length-1; i++) {
      let j = 1
      while((i+j<socios.length)&&(socios[i].apellido.toLowerCase() == socios[i+j].apellido.toLowerCase())){
        if(socios[i].nombre.toLowerCase() > socios[i+j].nombre.toLowerCase()){
          const socioAux = socios[i]
          socios[i] = socios[i+j]
          socios[i+j]=socioAux
        }
        j++
      }
    }
    // Filtros dependiendo la tarea
    switch(tarea) {
      case "socios": 
        socios = socios.filter(socio => !socio.socioNuevo)
        if(inputBuscar){ 
          socios = socios.filter( (socio) => ((socio.apellido + " " + socio.nombre).slice(0, inputBuscar.length).toLowerCase() == inputBuscar.toLowerCase()) || ((socio.nombre + " " + socio.apellido).slice(0, inputBuscar.length).toLowerCase() == inputBuscar.toLowerCase()) || (socio.dni.slice(0, inputBuscar.length) == inputBuscar)) 
        }
      break
      case "cumpleaneros":
        socios = socios.filter(socio => !socio.socioNuevo)
        const hoy = new Date()
        const dia = hoy.getDate()>9? hoy.getDate() :  ("0" + hoy.getDate())
        const mes = hoy.getMonth()>8? (hoy.getMonth()+1) : ("0" + (hoy.getMonth()+1))
        socios = socios.filter(socio => socio.fechaNacimiento.slice(5,10) == mes+"-"+dia)
      break
      case "nuevos":
        socios = socios.filter(socio => socio.socioNuevo)
        break
    }
    const sociosPorPag = 30;
    const cantPag = [] 
    for (let i = 0; i < Math.trunc((socios.length%sociosPorPag)? socios.length/sociosPorPag + 1 : socios.length/sociosPorPag); i++) {
      cantPag.push(i+1)
    }
    setCantPag(cantPag)
    socios = socios.slice((nroPag-1)*sociosPorPag, sociosPorPag*nroPag)
    setSocios(socios)
  } 
      
      
  useEffect(() => {
    //Mandar a iniciar sesion si no es el admin
    if(isAdmin){
      navigate('/admin/auth')
    }
    getSocios()
  }, [inputBuscar, cambioSocios, pag])
  
  return (
    <>
      <div className={styles.contenedorList}>
        <h2 className={styles.titulo}>{tarea.toUpperCase()}</h2>
        {buscar}
        {socios.length? socios.map(socio => <Card socio={socio} key={socio.id} tarea={tarea} setCambioSocios={setCambioSocios} cambioSocios={cambioSocios}/>) : <h3>No hay socios que coincidan con la busqueda</h3>}
        <div className={styles.nrosPag}>{socios.length? cantPag.map(num => <Link to={`/admin/${tarea}/${num}`}>{num}</Link>) : undefined}</div>
      </div>
      <Link to="/admin" className={styles.btnVolver}>Volver</Link>
    </>
  )
}

export default ItemListContainer