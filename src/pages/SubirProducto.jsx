import { useState } from 'react'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

function SubirProducto() {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [price, setPrice] = useState('')
  const [categoria, setCategoria] = useState('')
  const [fotoUrl, setFotoUrl] = useState('')
  const [mensaje, setMensaje] = useState('')

  const subirProducto = async () => {
    if (!title || !desc || !price || !categoria || !fotoUrl) {
      setMensaje('❌ Llena todos los campos')
      return
    }

    try {
      await addDoc(collection(db, 'productos'), {
        title,
        desc,
        price: parseFloat(price),
        categoria,
        fotos: [fotoUrl]
      })
      setMensaje('✅ Producto agregado correctamente')
      setTitle('')
      setDesc('')
      setPrice('')
      setCategoria('')
      setFotoUrl('')
    } catch (error) {
      setMensaje('❌ Error: ' + error.message)
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Subir nuevo producto</h2>

      <input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} /><br />
      <input placeholder="Descripción" value={desc} onChange={e => setDesc(e.target.value)} /><br />
      <input type="number" placeholder="Precio" value={price} onChange={e => setPrice(e.target.value)} /><br />
      
      <select value={categoria} onChange={e => setCategoria(e.target.value)}>
        <option value="">Selecciona una categoría</option>
        <option value="hombre">Hombre</option>
        <option value="mujer">Mujer</option>
        <option value="rebajas">Rebajas</option>
        <option value="unisex">Unisex</option>
      </select><br />

      <input placeholder="URL de la foto" value={fotoUrl} onChange={e => setFotoUrl(e.target.value)} /><br /><br />

      <button
        onClick={subirProducto}
        style={{
          backgroundColor: '#4caf50',
          color: 'white',
          padding: '0.7rem 1.2rem',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        📦 Subir producto
      </button>

      {mensaje && (
        <p style={{ marginTop: '1rem', color: mensaje.includes('✅') ? 'green' : 'red' }}>
          {mensaje}
        </p>
      )}
    </div>
  )
}

export default SubirProducto
