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

    // Validar si ya está apartado
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
    <div style={{ padding: '2rem' }}>
      <h2>Todos los productos</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {productos.map(p => (
          <div key={p.id} style={{ border: '1px solid #444', padding: '1rem', borderRadius: '10px', width: 250 }}>
            <img src={p.fotos?.[0]} alt={p.title} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: '8px' }} />
            <h4>{p.title}</h4>
            <p>{p.desc}</p>
            <p><strong>${p.price}</strong></p>
            {uidActual ? (
              <button onClick={() => apartar(p)} style={{ marginTop: '0.5rem' }}>
                ➕ Apartar
              </button>
            ) : (
              <Link to="/login">Inicia sesión para apartar</Link>
            )}
            {esAdmin && (
              <Link to={`/admin/editar/${p.id}`} style={{ color: '#f4c542', marginTop: '0.5rem', display: 'block' }}>
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
