import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { db, auth } from '../firebase'
import { doc, getDoc, addDoc, collection } from 'firebase/firestore'

function ProductoDetalle() {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    const obtenerProducto = async () => {
      const ref = doc(db, 'productos', id)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setProducto({ id: snap.id, ...snap.data() })
      }
    }
    obtenerProducto()
  }, [id])

  const apartar = async () => {
    const user = auth.currentUser
    if (!user) {
      setMensaje('❌ Inicia sesión para apartar el producto')
      return
    }

    try {
      await addDoc(collection(db, 'apartados'), {
        uid: user.uid,
        title: producto.title,
        price: producto.price,
        fotos: producto.fotos,
        fecha: new Date()
      })
      setMensaje('✅ Producto apartado con éxito')
    } catch (e) {
      setMensaje('❌ Error al apartar: ' + e.message)
    }
  }

  if (!producto) return <p style={{ padding: '2rem', color: 'white' }}>⏳ Cargando producto...</p>

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: 'var(--color-principal)',
      color: 'var(--color-secundario)',
      minHeight: '100vh'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{producto.title}</h2>
      <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>{producto.desc}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${producto.price}</p>

      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        margin: '1.5rem 0'
      }}>
        {producto.fotos.map((f, i) => (
          <img
            key={i}
            src={f}
            alt={`Foto ${i + 1}`}
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '10px',
              border: '2px solid #444'
            }}
          />
        ))}
      </div>

      <button
        onClick={apartar}
        style={{
          backgroundColor: '#4caf50',
          color: 'white',
          padding: '0.8rem 1.5rem',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        📌 Apartar
      </button>

      {mensaje && (
        <p style={{
          marginTop: '1.5rem',
          color: mensaje.includes('✅') ? 'lightgreen' : 'red'
        }}>
          {mensaje}
        </p>
      )}
    </div>
  )
}

export default ProductoDetalle
