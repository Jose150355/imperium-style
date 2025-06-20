import { useEffect, useState } from 'react'
import { db, auth } from '../firebase'
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { Link } from 'react-router-dom'

function Rebajas() {
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
        .filter(p => p.categoria === 'rebajas')
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
    <div style={{ padding: '2rem', backgroundColor: 'var(--color-principal)', color: 'var(--color-secundario)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Productos en Rebajas</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
        <input
          placeholder="Buscar por nombre"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #444', background: '#111', color: '#ddd' }}
        />
        <input
          placeholder="Precio mínimo"
          type="number"
          value={precioMin}
          onChange={e => setPrecioMin(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #444', background: '#111', color: '#ddd' }}
        />
        <input
          placeholder="Precio máximo"
          type="number"
          value={precioMax}
          onChange={e => setPrecioMax(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #444', background: '#111', color: '#ddd' }}
        />
        <select
          value={orden}
          onChange={e => setOrden(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', background: '#111', color: '#ddd', border: '1px solid #444' }}
        >
          <option value="asc">Precio: menor a mayor</option>
          <option value="desc">Precio: mayor a menor</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
        {filtrados.map(p => (
          <div
            key={p.id}
            style={{
              backgroundColor: '#111',
              border: '1px solid #333',
              padding: '1rem',
              borderRadius: '12px',
              width: 260,
              textAlign: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            <img
              src={p.fotos?.[0]}
              alt={p.title}
              style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }}
            />
            <h4>{p.title}</h4>
            <p style={{ fontSize: '0.9rem' }}>{p.desc}</p>
            <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>${p.price}</p>

            <button
              onClick={() => apartar(p)}
              style={{
                marginTop: '0.5rem',
                backgroundColor: 'var(--color-acento)',
                color: '#000',
                border: 'none',
                padding: '0.4rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              ➕ Apartar
            </button>

            {esAdmin && (
              <>
                <Link
                  to={`/admin/editar/${p.id}`}
                  style={{
                    color: 'var(--color-acento)',
                    display: 'inline-block',
                    marginTop: '0.5rem',
                    fontSize: '0.9rem'
                  }}
                >
                  ✏️ Editar
                </Link>
                <br />
                <button
                  onClick={() => eliminarProducto(p.id)}
                  style={{
                    marginTop: '0.5rem',
                    background: '#b22222',
                    color: 'white',
                    border: 'none',
                    padding: '0.4rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
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

export default Rebajas
