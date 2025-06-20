// src/components/RutaPrivada.jsx
import { Navigate } from 'react-router-dom'
import { auth } from '../firebase'

function RutaPrivada({ children }) {
  const usuario = auth.currentUser

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default RutaPrivada
