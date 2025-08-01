// src/pages/MisApartados.jsx
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

    localStorage.setItem('productosSeleccionados', JSON.stringify(productos))

    const q = query(collection(db, 'apartados'), where('uid', '==', usuario.uid))
    const snapshot = await getDocs(q)
    const batch = snapshot.docs.map(docSnap => deleteDoc(doc(db, 'apartados', docSnap.id)))
    await Promise.all(batch)

    setProductos([])
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
    <div style={{ padding: '2rem', backgroundColor: 'var(--color-principal)', color: 'var(--color-secundario)' }}>
      <h2 style={{ textAlign: 'center' }}>Mis productos apartados</h2>

      {productos.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>No tienes productos apartados.</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginTop: '2rem' }}>
            {productos.map(p => (
              <div
                key={p.id}
                style={{
                  background: '#111',
                  border: '1px solid #333',
                  borderRadius: '10px',
                  padding: '1rem',
                  width: 220,
                  textAlign: 'center',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}
              >
                <img src={p.fotos?.[0]} alt={p.title} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: '6px' }} />
                <h4 style={{ marginTop: '0.5rem' }}>{p.title}</h4>
                <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>${p.price}</p>
                <button
                  onClick={() => quitarApartado(p.id)}
                  style={{
                    backgroundColor: '#b22222',
                    color: 'white',
                    border: 'none',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  ❌ Quitar
                </button>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button
              onClick={procederAlPedido}
              style={{
                backgroundColor: 'var(--color-acento)',
                color: '#000',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ✅ Proceder con productos
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default MisApartados
