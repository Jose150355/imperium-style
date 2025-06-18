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
      setMensaje('Inicia sesión para apartar')
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

  if (!producto) return <p style={{ padding: '2rem' }}>Cargando producto...</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{producto.title}</h2>
      <p>{producto.desc}</p>
      <p><strong>${producto.price}</strong></p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {producto.fotos.map((f, i) => (
          <img key={i} src={f} alt={`Foto ${i}`} style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
        ))}
      </div>

      <br />
      <button onClick={apartar}>Apartar</button>
      {mensaje && <p style={{ marginTop: '1rem', color: 'green' }}>{mensaje}</p>}
    </div>
  )
}

export default ProductoDetalle
