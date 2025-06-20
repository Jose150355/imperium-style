// src/components/Navbar.jsx
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { auth } from '../firebase'

function Navbar() {
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUsuario(user)
    })
    return () => unsubscribe()
  }, [])

  const cerrarSesion = async () => {
    await auth.signOut()
    localStorage.clear()
    window.location.href = '/'
  }

  const esAdmin = usuario?.email === 'gustavoraygadas10@gmail.com'

  return (
    <nav style={{
      backgroundColor: 'var(--color-principal)',
      padding: '1rem',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: 'var(--color-secundario)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img src="/imperium-logo.JPG" alt="Logo" style={{ height: '40px', borderRadius: '5px' }} />
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>IMPERIUM STYLE</div>
          <div style={{ fontSize: '0.85rem', color: '#ccc' }}>Tu estilo, Tu historia.</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: '#ccc' }}>Inicio</Link>
        <Link to="/hombre" style={{ color: '#ccc' }}>Hombre</Link>
        <Link to="/mujer" style={{ color: '#ccc' }}>Mujer</Link>
        <Link to="/rebajas" style={{ color: '#ccc' }}>Rebajas</Link>

        {usuario && !esAdmin && (
          <>
            <Link to="/mis-apartados" style={{ color: '#ccc' }}>Mis apartados</Link>
            <Link to="/confirmar-pedido" style={{ color: '#ccc' }}>Confirmar pedido</Link>
            <Link to="/mis-pedidos" style={{ color: '#ccc' }}>Mis pedidos</Link>
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
            <Link to="/perfil" style={{ color: '#ccc' }}>Mi perfil</Link>
            <button onClick={cerrarSesion} style={{
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              padding: '0.3rem 0.7rem',
              cursor: 'pointer',
              borderRadius: '4px'
            }}>
              🔒 Cerrar sesión
            </button>
          </>
        )}

        {!usuario && (
          <>
            <Link to="/login" style={{ color: '#ccc' }}>Iniciar sesión</Link>
            <Link to="/register" style={{ color: '#ccc' }}>Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
