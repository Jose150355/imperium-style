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
    <div style={{
      backgroundColor: 'var(--color-principal)',
      color: 'var(--color-secundario)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '2rem',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 0 20px rgba(255,255,255,0.05)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>📦 Subir nuevo producto</h2>

        <input
          placeholder="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Descripción"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={e => setPrice(e.target.value)}
          style={inputStyle}
        />

        <select
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
          style={{ ...inputStyle, backgroundColor: '#000', color: 'white' }}
        >
          <option value="">Selecciona una categoría</option>
          <option value="hombre">Hombre</option>
          <option value="mujer">Mujer</option>
          <option value="rebajas">Rebajas</option>
          <option value="unisex">Unisex</option>
        </select>

        <input
          placeholder="URL de la foto"
          value={fotoUrl}
          onChange={e => setFotoUrl(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={subirProducto}
          style={{
            width: '100%',
            padding: '0.8rem',
            borderRadius: '8px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            marginTop: '1rem'
          }}
        >
          ✅ Subir producto
        </button>

        {mensaje && (
          <p style={{
            marginTop: '1rem',
            color: mensaje.includes('✅') ? '#4caf50' : 'red',
            textAlign: 'center'
          }}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '0.7rem',
  borderRadius: '8px',
  border: '1px solid #888',
  marginBottom: '1rem',
  background: '#000',
  color: 'white'
}

export default SubirProducto
