import { useEffect, useState } from 'react'
import { db, auth } from '../firebase'
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { Link } from 'react-router-dom'

function Hombre() {
  const [productos, setProductos] = useState([])
  const [esAdmin, setEsAdmin] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [orden, setOrden] = useState('asc')

  useEffect(() => {
    const obtenerProductos = async () => {
      const snapshot = await getDocs(collection(db, 'productos'))
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(p => p.categoria === 'hombre')
      setProductos(data)
    }

    obtenerProductos()
  }, [])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && ['gustavoraygadas10@gmail.com'].includes(user.email)) {
        setEsAdmin(true)
      } else {
        setEsAdmin(false)
      }
    })
    return () => unsubscribe()
  }, [])

  const apartar = async (producto) => {
    const user = auth.currentUser
    if (!user) {
      alert('Debes iniciar sesión para apartar')
      return
    }
    await addDoc(collection(db, 'apartados'), {
      uid: user.uid,
      ...producto
    })
    alert('✅ Producto apartado')
  }

  const eliminarProducto = async (id) => {
    const confirmar = confirm('¿Eliminar este producto?')
    if (!confirmar) return
    await deleteDoc(doc(db, 'productos', id))
    setProductos(productos.filter(p => p.id !== id))
  }

  const filtrados = productos
    .filter(p =>
      p.title.toLowerCase().includes(busqueda.toLowerCase()) &&
      (!precioMin || p.price >= parseFloat(precioMin)) &&
      (!precioMax || p.price <= parseFloat(precioMax))
    )
    .sort((a, b) => orden === 'asc' ? a.price - b.price : b.price - a.price)

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Ropa para Hombre</h2>
      <input placeholder="Buscar por nombre" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
      <input placeholder="Precio mínimo" type="number" value={precioMin} onChange={e => setPrecioMin(e.target.value)} />
      <input placeholder="Precio máximo" type="number" value={precioMax} onChange={e => setPrecioMax(e.target.value)} />
      <select value={orden} onChange={e => setOrden(e.target.value)}>
        <option value="asc">Precio: menor a mayor</option>
        <option value="desc">Precio: mayor a menor</option>
      </select>

      <div>
        {filtrados.map(p => (
          <div key={p.id} style={{ border: '1px solid #444', padding: '1rem', margin: '1rem', maxWidth: 300 }}>
            <img src={p.fotos?.[0]} alt={p.title} width="100%" />
            <h4>{p.title}</h4>
            <p>{p.desc}</p>
            <p><strong>${p.price}</strong></p>
            <button onClick={() => apartar(p)}>Apartar</button>
            {esAdmin && (
              <>
                <Link to={`/admin/editar/${p.id}`} style={{ color: '#f4c542', marginTop: '0.5rem', display: 'inline-block' }}>
                  ✏️ Editar
                </Link>
                <br />
                <button onClick={() => eliminarProducto(p.id)} style={{ marginTop: '0.5rem', background: 'red', color: 'white' }}>
                  🗑️ Eliminar
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Hombre
