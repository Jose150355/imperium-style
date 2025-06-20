// src/components/RutaPrivada.jsx
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { auth } from '../firebase'

function RutaPrivada({ children }) {
  const [cargando, setCargando] = useState(true)
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUsuario(user)
      setCargando(false)
    })

    return () => unsubscribe()
  }, [])

  if (cargando) {
    return <p style={{ padding: '2rem', color: '#ccc' }}>Cargando autenticación...</p>
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default RutaPrivada
