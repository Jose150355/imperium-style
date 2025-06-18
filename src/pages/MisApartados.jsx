import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

function MisApartados() {
  const [productos, setProductos] = useState([])
  const [usuario, setUsuario] = useState(null)
  const navigate = useNavigate()

  const obtenerApartados = async (user) => {
    const q = query(collection(db, 'apartados'), where('uid', '==', user.uid))
    const snapshot = await getDocs(q)
    const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    setProductos(data)
  }

  const quitarApartado = async (id) => {
    await deleteDoc(doc(db, 'apartados', id))
    const nuevaLista = productos.filter(p => p.id !== id)
    setProductos(nuevaLista)
  }

  const procederAlPedido = async () => {
    if (!usuario || productos.length === 0) return

    // Guardar productos en localStorage
    localStorage.setItem('productosSeleccionados', JSON.stringify(productos))

    // Borrar todos los productos apartados del usuario
    const q = query(collection(db, 'apartados'), where('uid', '==', usuario.uid))
    const snapshot = await getDocs(q)
    const batch = snapshot.docs.map(docSnap => deleteDoc(doc(db, 'apartados', docSnap.id)))
    await Promise.all(batch)

    setProductos([])

    // Redirigir a confirmar pedido
    navigate('/confirmar')
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUsuario(user)
        obtenerApartados(user)
      }
    })
    return () => unsubscribe()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Mis productos apartados</h2>

      {productos.length === 0 ? (
        <p>No tienes productos apartados.</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {productos.map(p => (
              <div
                key={p.id}
                style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '1rem', width: 200 }}
              >
                <img src={p.fotos?.[0]} alt={p.title} style={{ width: '100%', borderRadius: '5px' }} />
                <h4>{p.title}</h4>
                <p><strong>${p.price}</strong></p>
                <button
                  onClick={() => quitarApartado(p.id)}
                  style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '5px', marginTop: '0.5rem' }}
                >
                  ❌ Quitar
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={procederAlPedido}
            style={{
              marginTop: '2rem',
              backgroundColor: '#4caf50',
              color: 'white',
              padding: '0.7rem 1.2rem',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1rem'
            }}
          >
            ✅ Proceder con productos
          </button>
        </>
      )}
    </div>
  )
}

export default MisApartados
