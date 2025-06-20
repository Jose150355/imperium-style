import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { Link } from 'react-router-dom'

function AdminPanel() {
  const [productos, setProductos] = useState([])
  const [mensaje, setMensaje] = useState('')
  const adminEmails = ['gustavoraygadas10@gmail.com']

  useEffect(() => {
    const fetchProductos = async () => {
      const snapshot = await getDocs(collection(db, 'productos'))
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setProductos(lista)
    }

    fetchProductos()
  }, [])

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm('¿Eliminar este producto?')
    if (!confirmar) return

    try {
      await deleteDoc(doc(db, 'productos', id))
      setProductos(productos.filter(p => p.id !== id))
      setMensaje('✅ Producto eliminado correctamente')
    } catch (err) {
      setMensaje('❌ Error al eliminar: ' + err.message)
    }
  }

  const user = auth.currentUser
  const esAdmin = user && adminEmails.includes(user.email)

  if (!esAdmin) {
    return <p style={{ padding: '2rem', color: 'white' }}>🚫 No tienes permiso para ver esta página</p>
  }

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <h2 style={{ marginBottom: '1rem' }}>🛠️ Admin - Panel de productos</h2>
      {mensaje && <p style={{ color: mensaje.includes('✅') ? 'lightgreen' : 'red' }}>{mensaje}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {productos.map((producto) => (
          <div
            key={producto.id}
            style={{
              backgroundColor: '#1a1a1a',
              borderRadius: '12px',
              padding: '1rem',
              boxShadow: '0 0 10px rgba(255,255,255,0.05)',
              border: '1px solid #333'
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

export default AdminPanel
