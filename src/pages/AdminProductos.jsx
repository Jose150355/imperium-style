import { Link } from 'react-router-dom'
import { auth } from '../firebase'
import { useEffect, useState } from 'react'

function Navbar() {
  const [user, setUser] = useState(null)
  const [esAdmin, setEsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u)

      const adminEmails = ['gustavoraygadas10@gmail.com']
      setEsAdmin(u && adminEmails.includes(u.email))
    })

    return () => unsubscribe()
  }, [])

  return (
    <nav style={{ padding: '1rem', background: '#111', color: '#fff', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
      <div>
        <Link to="/" style={{ margin: '0 1rem', color: '#fff' }}>Inicio</Link>
        <Link to="/hombre" style={{ margin: '0 1rem', color: '#fff' }}>Hombre</Link>
        <Link to="/mujer" style={{ margin: '0 1rem', color: '#fff' }}>Mujer</Link>
        <Link to="/rebajas" style={{ margin: '0 1rem', color: '#fff' }}>Rebajas</Link>

        {user && !esAdmin && (
          <>
            <Link to="/apartados" style={{ margin: '0 1rem', color: '#90ee90' }}>Mis apartados</Link>
            <Link to="/confirmar" style={{ margin: '0 1rem', color: '#90ee90' }}>Confirmar pedido</Link>
            <Link to="/mispedidos" style={{ margin: '0 1rem', color: '#90ee90' }}>Mis pedidos</Link>
          </>
        )}

        {user && esAdmin && (
          <>
            <Link to="/admin/pedidos" style={{ margin: '0 1rem', color: '#f4c542' }}>Ver pedidos</Link>
            <Link to="/admin/productos" style={{ margin: '0 1rem', color: '#f4c542' }}>Subir producto</Link>
          </>
        )}

        {user && (
          <Link to="/perfil" style={{ margin: '0 1rem', color: '#90ee90' }}>Mi perfil</Link>
        )}
      </div>

      <div>
        {!user && (
          <>
            <Link to="/login" style={{ margin: '0 1rem', color: '#fff' }}>Iniciar sesión</Link>
            <Link to="/register" style={{ margin: '0 1rem', color: '#fff' }}>Registrarse</Link>
          </>
        )}

        {user && (
          <button
            onClick={() => auth.signOut()}
            style={{ margin: '0 1rem', color: '#fff', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
