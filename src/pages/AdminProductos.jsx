import { useEffect, useState } from 'react'
import { db, auth } from '../firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { Link } from 'react-router-dom'

function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [mensaje, setMensaje] = useState('')
  const adminEmails = ['gustavoraygadas10@gmail.com']

  const user = auth.currentUser
  const esAdmin = user && adminEmails.includes(user.email)

  useEffect(() => {
    const obtenerProductos = async () => {
      const snapshot = await getDocs(collection(db, 'productos'))
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setProductos(data)
    }

    obtenerProductos()
  }, [])

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm('¿Eliminar este producto?')
    if (!confirmar) return

    try {
      await deleteDoc(doc(db, 'productos', id))
      setProductos(productos.filter(p => p.id !== id))
      setMensaje('✅ Producto eliminado correctamente')
    } catch (error) {
      setMensaje('❌ Error al eliminar: ' + error.message)
    }
  }

  if (!esAdmin) {
    return <p style={{ padding: '2rem', color: 'white' }}>🚫 No tienes permiso para ver esta página</p>
  }

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <h2 style={{ marginBottom: '1rem' }}>📋 Admin - Lista de Productos</h2>
      {mensaje && <p style={{ color: mensaje.includes('✅') ? 'lightgreen' : 'red' }}>{mensaje}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {productos.map((producto) => (
          <div
            key={producto.id}
            style={{
              backgroundColor: '#1a1a1a',
              borderRadius: '12px',
              padding: '1rem',
              border: '1px solid #333',
              boxShadow: '0 0 10px rgba(255,255,255,0.05)'
            }}
          >
            <img
              src={producto.fotos[0]}
              alt={producto.title}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '10px',
                marginBottom: '1rem'
              }}
            />
            <h4 style={{ fontSize: '1.1rem' }}>{producto.title}</h4>
            <p style={{ fontSize: '0.9rem', color: '#ccc' }}>{producto.desc}</p>
            <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>${producto.price}</p>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <Link
                to={`/admin/editar/${producto.id}`}
                style={{
                  backgroundColor: '#f4c542',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: '#000',
                  fontWeight: 'bold'
                }}
              >
                ✏️ Editar
              </Link>

              <button
                onClick={() => eliminarProducto(producto.id)}
                style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminProductos
