import { useEffect, useState } from 'react'
import { db, auth } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Link } from 'react-router-dom'

function ProductosPorCategoria({ categoria }) {
  const [productos, setProductos] = useState([])
  const [user, setUser] = useState(null)

  const adminEmails = ['gustavoraygadas10@gmail.com']
  const esAdmin = user && adminEmails.includes(user.email)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u))
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'productos'))
        const productosFiltrados = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(p => p.categoria === categoria)
        setProductos(productosFiltrados)
      } catch (error) {
        console.error('Error al obtener productos:', error)
      }
    }

    obtenerProductos()
  }, [categoria])

  return (
    <div style={{ padding: '2rem', backgroundColor: '#000', minHeight: '100vh' }}>
      <h2 style={{ color: '#ccc', fontSize: '1.8rem', marginBottom: '1.5rem' }}>
        {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
      </h2>

      {productos.length === 0 ? (
        <p style={{ color: '#aaa' }}>No hay productos por el momento.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {productos.map(producto => (
            <div
              key={producto.id}
              style={{
                backgroundColor: '#111',
                color: '#ddd',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 2px 6px rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <img
                src={producto.fotos[0]}
                alt={producto.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              />
              <h4 style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>{producto.title}</h4>
              <p style={{ fontSize: '0.9rem', color: '#bbb' }}>{producto.desc}</p>
              <p style={{ fontWeight: 'bold', fontSize: '1rem', margin: '0.5rem 0' }}>${producto.price}</p>

              {user ? (
                <button style={{
                  backgroundColor: '#f4c542',
                  color: '#000',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}>
                  Apartar
                </button>
              ) : (
                <Link to="/login" style={{ color: '#6495ed', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Inicia sesión para apartar
                </Link>
              )}

              {esAdmin && (
                <Link
                  to={`/admin/editar/${producto.id}`}
                  style={{
                    color: '#f4c542',
                    marginTop: '0.8rem',
                    fontSize: '0.85rem',
                    textDecoration: 'underline'
                  }}
                >
                  ✏️ Editar
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductosPorCategoria
