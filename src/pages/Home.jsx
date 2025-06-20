import { useEffect, useState } from 'react'
import { db, auth } from '../firebase'
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore'
import { Link } from 'react-router-dom'

function Home() {
  const [productos, setProductos] = useState([])
  const [esAdmin, setEsAdmin] = useState(false)
  const [uidActual, setUidActual] = useState(null)

  useEffect(() => {
    const obtenerProductos = async () => {
      const snapshot = await getDocs(collection(db, 'productos'))
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setProductos(data)
    }

    obtenerProductos()
  }, [])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUidActual(user.uid)
        if (['gustavoraygadas10@gmail.com'].includes(user.email)) {
          setEsAdmin(true)
        } else {
          setEsAdmin(false)
        }
      } else {
        setUidActual(null)
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

    const q = query(collection(db, 'apartados'), where('uid', '==', user.uid), where('id', '==', producto.id))
    const snapshot = await getDocs(q)
    if (!snapshot.empty) {
      alert('Este producto ya está en tus apartados')
      return
    }

    await addDoc(collection(db, 'apartados'), {
      uid: user.uid,
      ...producto
    })

    alert('✅ Producto apartado')
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: 'var(--color-principal)', color: 'var(--color-secundario)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Todos los productos</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
        {productos.map(p => (
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
              style={{
                width: '100%',
                height: 200,
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '0.5rem'
              }}
            />
            <h4>{p.title}</h4>
            <p style={{ fontSize: '0.9rem' }}>{p.desc}</p>
            <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>${p.price}</p>

            {uidActual ? (
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
            ) : (
              <Link to="/login" style={{ color: 'var(--color-link)' }}>
                Inicia sesión para apartar
              </Link>
            )}

            {esAdmin && (
              <Link
                to={`/admin/editar/${p.id}`}
                style={{
                  display: 'block',
                  marginTop: '0.5rem',
                  color: 'var(--color-acento)',
                  fontSize: '0.9rem'
                }}
              >
                ✏️ Editar
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
