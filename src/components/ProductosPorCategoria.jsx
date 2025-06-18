import { useEffect, useState } from 'react'
import { db, auth } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Link } from 'react-router-dom'

function ProductosPorCategoria({ categoria }) {
  const [productos, setProductos] = useState([])
  const [user, setUser] = useState(null)

  const adminEmails = ['TU_CORREO_ADMIN@gmail.com'] // ← Cámbialo por tu correo
  const esAdmin = user && adminEmails.includes(user.email)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u))
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const obtenerProductos = async () => {
      const snapshot = await getDocs(collection(db, 'productos'))
      const productosFiltrados = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(p => p.categoria === categoria)
      setProductos(productosFiltrados)
    }

    obtenerProductos()
  }, [categoria])

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{categoria.charAt(0).toUpperCase() + categoria.slice(1)}</h2>
      {productos.length === 0 ? (
        <p>No hay productos por el momento.</p>
      ) : (
        productos.map(producto => (
          <div key={producto.id} style={{ border: '1px solid #444', padding: '1rem', marginBottom: '1rem' }}>
            <img src={producto.fotos[0]} alt={producto.title} width={150} />
            <h4>{producto.title}</h4>
            <p>{producto.desc}</p>
            <p>${producto.price}</p>

            <button onClick={() => alert('Función de apartar aún no implementada')}>Apartar</button>

            {esAdmin && (
              <Link
                to={`/admin/editar/${producto.id}`}
                style={{ color: '#f4c542', marginTop: '0.5rem', display: 'inline-block' }}
              >
                ✏️ Editar
              </Link>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default ProductosPorCategoria
