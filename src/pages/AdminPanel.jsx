import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { Link } from 'react-router-dom'

function AdminPanel() {
  const [productos, setProductos] = useState([])
  const [mensaje, setMensaje] = useState('')
  const adminEmails = ['gustavoraygadas10@gmail.com'] // reemplaza con tu correo

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
      setMensaje('✅ Producto eliminado')
    } catch (err) {
      setMensaje('❌ Error al eliminar: ' + err.message)
    }
  }

  const user = auth.currentUser
  const esAdmin = user && adminEmails.includes(user.email)

  if (!esAdmin) {
    return <p style={{ padding: '2rem' }}>🚫 No tienes permiso para ver esta página</p>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin - Panel de productos</h2>
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

      {productos.map((producto) => (
        <div key={producto.id} style={{ border: '1px solid #444', padding: '1rem', margin: '1rem 0' }}>
          <img src={producto.fotos[0]} alt={producto.title} width={100} />
          <h4>{producto.title}</h4>
          <p>{producto.desc}</p>
          <p>${producto.price}</p>

          <Link to={`/admin/editar/${producto.id}`} style={{ color: '#f4c542', marginRight: '1rem' }}>
            ✏️ Editar
          </Link>

          <button onClick={() => eliminarProducto(producto.id)} style={{ color: 'red' }}>
            🗑️ Eliminar
          </button>
        </div>
      ))}
    </div>
  )
}

export default AdminPanel
