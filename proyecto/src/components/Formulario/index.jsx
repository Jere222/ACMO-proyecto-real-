import { useContext, useEffect, useState } from 'react'
import styles from './Formulario.module.scss'
import { collection, addDoc, getDocs, doc, getDoc, updateDoc} from 'firebase/firestore'
import db from '../../../db/firebase-config.js'
import { useNavigate, useParams } from 'react-router-dom'
import { IsAdminContext } from '../../contexts/isAdminContext.jsx'
import Swal from 'sweetalert2'

const Formulario = () => {
  const {isAdmin} = useContext(IsAdminContext)
  const {id} = useParams()
  const sociosRef = collection(db, "Socios")
  const [inputNom, setInputNom] = useState("")
  const [inputAp, setInputAp] = useState("")
  const [inputFechaNac, setInputFechaNac] = useState("")
  const [inputDom, setInputDom] = useState("")
  const [inputCelu, setInputCelu] = useState("")
  const [inputEmail, setInputEmail] = useState("")
  const [inputDni, setInputDni] = useState("")
  const [inputLocalidad, setInputLocalidad] = useState("")
  const [mostrar, setMostrar] = useState(false)
  const navigate = useNavigate()
  const socioRef = id? doc(db, "Socios", id) : 0


  const getBand = async() =>{
    let band = true;
    const sociosCollection = await getDocs(sociosRef)
    const socios = sociosCollection.docs.map(doc => ({"dni": doc.data().dni, "id": doc.id}))
    if(id) socios.forEach(socio => (((socio.dni ==  inputDni)&&(socio.id != id))? (band = false) : (band=band)))
    else socios.forEach(socio => ((socio.dni ==  inputDni)? (band = false) : (band=band)))
    if(!band){
      Swal.fire({
        title: "Error", 
        text: "el dni ingresado ya fue registrado por otro usuario", 
        icon: "warning",
        color: "white",
        background: "black",
        confirmButtonColor: "orange"
      })
    }
    return((band)&&(inputNom!="")&&(inputAp!="")&&(inputFechaNac!="")&&(inputLocalidad!="")&&(inputDom!="")&&(inputCelu!="")&&(inputEmail!="")&&(inputDni!=""))
  }

  const handleReset = () => {
    setInputNom(""), setInputAp(""), setInputFechaNac(""), setInputLocalidad(""), setInputDom(""), setInputCelu(""), setInputEmail(""), setInputDni(""), setMostrar(false)
  }


  const handleSubmit = async(e) => {
    e.preventDefault()
    const band = await getBand()
    if(band){
      const socio = {
        "nombre": inputNom.toUpperCase(),
        "apellido": inputAp.toUpperCase(),
        "fechaNacimiento": inputFechaNac,
        "localidad": inputLocalidad,
        "domicilio": inputDom,
        "nroCelular": inputCelu,
        "email": inputEmail,
        "dni": inputDni       
      }
      if(id) {
        await updateDoc(socioRef, socio) 
        Swal.fire({
          title: "Socio actualizado",
          icon: "success",
          confirmButtonColor: "green",
          confirmButtonText: "volver",
          color: "white",
          background: "black"
        }) .then(()=> navigate('/admin')) 
      } 
      else {
        addDoc(sociosRef, {...socio, ...{"socioNuevo": true}})
        Swal.fire({
          title: "Muchas gracias por tu ayuda con la actualizacion de datos",
          icon: "success",
          confirmButtonColor: "green",
          confirmButtonText: "De nada!",
          color: "white",
          background: "black"
        })
      }
      handleReset()
    } else {
      setMostrar(true)
    }
  }

  const setSocio = async() => {
    const doc = await getDoc(socioRef)
    const socio = doc.data()
    setInputNom(socio.nombre)
    setInputAp(socio.apellido)
    setInputFechaNac(socio.fechaNacimiento)
    setInputLocalidad(socio.localidad)
    setInputDom(socio.domicilio)
    setInputCelu(socio.nroCelular)
    setInputEmail(socio.email)
    setInputDni(socio.dni)
  } 
  
  useEffect(() => {
    //Mandar a iniciar sesion si no es el admin
    if(id&&isAdmin){
      navigate('/admin/auth')
    }
    if(id) setSocio()
  }, [])
  
  return (
    
      <form className={styles.formSocios} onSubmit={handleSubmit} onReset={handleReset}>
      <div><p>Nombre:</p> <p className={(mostrar&&(inputNom==""))? styles.advertencia : styles.noMostrar}>*debe ingresar un nombre</p> <input type="text" onChange={(e) =>setInputNom(e.target.value)} value={inputNom}/></div>
      <div><p>Apellido:</p> <p className={(mostrar&&(inputAp==""))? styles.advertencia : styles.noMostrar}>*debe ingresar el apellido</p> <input type="text" onChange={(e) =>setInputAp(e.target.value)} value={inputAp}/></div>
      <div><p>Fecha de nacimiento:</p> <p className={(mostrar&&(inputFechaNac==""))? styles.advertencia : styles.noMostrar}>*debe ingresar la fecha de nacimiento</p> <input type="date" onChange={(e) =>setInputFechaNac(e.target.value)} value={inputFechaNac}/></div>
      <div><p>Localidad:</p> <p className={(mostrar&&(inputLocalidad==""))? styles.advertencia : styles.noMostrar}>*debe ingresar una localidad</p> <input type="text" onChange={(e) =>setInputLocalidad(e.target.value)} value={inputLocalidad}/></div>
      <div><p>Domicilio:</p> <p className={(mostrar&&(inputDom==""))? styles.advertencia : styles.noMostrar}>*debe ingresar un domicilio</p> <input type="text" onChange={(e) =>setInputDom(e.target.value)} value={inputDom}/></div>
      <div><p>Nro. de celular:</p> <p className={(mostrar&&(inputCelu==""))? styles.advertencia : styles.noMostrar}>*debe ingresar un nro de celular</p> <input type="text" onChange={(e) =>setInputCelu(e.target.value)} value={inputCelu}/></div>
      <div><p>Email:</p> <p className={(mostrar&&(inputEmail==""))? styles.advertencia : styles.noMostrar}>*debe ingresar un Email</p> <input type="email" onChange={(e) =>setInputEmail(e.target.value)} value={inputEmail}/></div>
      <div><p>DNI:</p> <p className={(mostrar&&(inputDni==""))? styles.advertencia : styles.noMostrar}>*debe ingresar un dni</p> <input type="text" onChange={(e) =>setInputDni(e.target.value)} value={inputDni}/></div>
      <div className={styles.btns}><input type="submit" value={id? "Actualizar" : "Confirmar"} /> <input type="reset" value="Restablecer"/></div>
      </form>
  )
}

export default Formulario