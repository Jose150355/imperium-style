import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { auth } from '../firebase'

function Navbar() {
  const [usuario, setUsuario] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUsuario(user)
    })
    return () => unsubscribe()
  }, [])

  const cerrarSesion = async () => {
    await auth.signOut()
    localStorage.clear()
    setUsuario(null)
    navigate('/') // Redirige a inicio
  }

  const esAdmin = usuario?.email === 'gustavoraygadas10@gmail.com'

  return (
    <nav style={{ backgroundColor: '#111', padding: '1rem', display: 'flex', gap: '1.5rem', color: 'white' }}>
      <Link to="/">Inicio</Link>
      <Link to="/hombre">Hombre</Link>
      <Link to="/mujer">Mujer</Link>
      <Link to="/rebajas">Rebajas</Link>

      {usuario && !esAdmin && (
        <>
          <Link to="/mis-apartados">Mis apartados</Link>
          <Link to="/confirmar-pedido">Confirmar pedido</Link>
          <Link to="/mis-pedidos">Mis pedidos</Link>
        </>
      )}

      {usuario && esAdmin && (
        <>
          <Link to="/admin/pedidos" style={{ color: '#ffc107' }}>Ver pedidos</Link>
          <Link to="/admin/subir" style={{ color: '#ffc107' }}>Subir producto</Link>
        </>
      )}

      {usuario && (
        <>
          <Link to="/perfil">Mi perfil</Link>
          <button
            onClick={cerrarSesion}
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              padding: '0.3rem 0.7rem',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            🔒 Cerrar sesión
          </button>
        </>
      )}

      {!usuario && (
        <>
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/register">Registrarse</Link>
        </>
      )}
    </nav>
  )
}

export default Navbar
