import { createContext, useState } from "react"

export const IsAdminContext = createContext()

export const IsAdminProvider = ({ children }) => {
  
  const [isAdmin, setIsAdmin] = useState(false)
  const getIsAdmin = () => {
    setIsAdmin(false)
  }
  
  return (
    <IsAdminContext.Provider value = {{isAdmin, getIsAdmin}}>
        {children}
    </IsAdminContext.Provider>
  )

}
