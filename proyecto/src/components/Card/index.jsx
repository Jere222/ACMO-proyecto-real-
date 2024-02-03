import { Link } from 'react-router-dom'
import styles from './Card.module.scss'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import db from '../../../db/firebase-config'
import Swal from 'sweetalert2'

const Card = ({socio, tarea, setCambioSocios, cambioSocios}) => {
  const socioRef = doc(db, "Socios", socio.id)

  const quitarNuevo = async() =>{
    await updateDoc(socioRef, {"socioNuevo": false}) 
    setCambioSocios(!cambioSocios)
  }
  const PasarANuevo = async() =>{
    await updateDoc(socioRef, {"socioNuevo": true}) 
    setCambioSocios(!cambioSocios)
  }
  const quitar = async() =>{
    Swal.fire({
      title: "¿Seguro que quiere eliminar a este socio?",
      showDenyButton: true,
      showCloseButton: true,
      confirmButtonText: "Borrar",
      denyButtonText: "No Borrar",
      confirmButtonColor: "green",
      denyButtonColor: "orange",
      color: "white",
      background: "black",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Socio eliminado")
        deleteDoc(socioRef) 
        setCambioSocios(!cambioSocios) 
      }
    })
  }
  return (
    <div className={styles.card}>
      <Link to={`/admin/socio/${socio.id}`}>
        <h2>{socio.apellido + " " + socio.nombre}</h2>
        <p>{socio.fechaNacimiento.slice(8,10) + socio.fechaNacimiento.slice(4,8) + socio.fechaNacimiento.slice(0,4)}</p>
        <p>{socio.localidad}</p>
        <p>{socio.domicilio}</p>
        <p>{socio.nroCelular}</p>
        <p>{socio.email}</p>
        <p>{socio.dni}</p>
      </Link>
      {(tarea == "nuevos")? <Link className={styles.btnCard} onClick={quitarNuevo} >Pasar a socio Normal</Link> : undefined}
      {(tarea == "nuevos")? <Link className={styles.btnCard} onClick={quitar} >Eliminar socio</Link> : undefined}
      {(tarea != "nuevos")? <Link className={styles.btnCard} onClick={PasarANuevo} >Pasar a nuevos</Link> : undefined}
    </div>
  )
}

export default Card