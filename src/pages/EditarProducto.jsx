import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'

function EditarProducto() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [price, setPrice] = useState('')
  const [categoria, setCategoria] = useState('')
  const [fotos, setFotos] = useState([''])
  const [mensaje, setMensaje] = useState('')
  const [esAdmin, setEsAdmin] = useState(false)

  useEffect(() => {
    const verificarAdmin = () => {
      const user = auth.currentUser
      if (user && ['gustavoraygadas10@gmail.com'].includes(user.email)) {
        setEsAdmin(true)
      } else {
        setEsAdmin(false)
      }
    }

    const obtenerProducto = async () => {
      const ref = doc(db, 'productos', id)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const data = snap.data()
        setTitle(data.title)
        setDesc(data.desc)
        setPrice(data.price)
        setCategoria(data.categoria)
        setFotos(data.fotos || [''])
      }
    }

    verificarAdmin()
    obtenerProducto()
  }, [id])

  const handleFotoChange = (index, value) => {
    const nuevas = [...fotos]
    nuevas[index] = value
    setFotos(nuevas)
  }

  const actualizarProducto = async () => {
    if (!title || !desc || !price || fotos.some(f => !f)) {
      setMensaje('❌ Completa todos los campos y fotos')
      return
    }

    try {
      await updateDoc(doc(db, 'productos', id), {
        title,
        desc,
        price: parseFloat(price),
        categoria,
        fotos
      })
      setMensaje('✅ Producto actualizado')
      setTimeout(() => navigate('/'), 1500)
    } catch (e) {
      setMensaje('❌ Error: ' + e.message)
    }
  }

  if (!esAdmin) {
    return <p style={{ padding: '2rem', color: 'white' }}>🚫 No tienes permiso para ver esta página</p>
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: 'var(--color-principal)', color: 'var(--color-secundario)', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center' }}>✏️ Editar producto</h2>

      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Nombre del producto"
          style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc', marginTop: '1rem' }}
        />
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Descripción"
          style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc', marginTop: '1rem' }}
        />
        <input
          value={price}
          onChange={e => setPrice(e.target.value)}
          type="number"
          placeholder="Precio"
          style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc', marginTop: '1rem' }}
        />

        <select
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', marginTop: '1rem' }}
        >
          <option value="hombre">Hombre</option>
          <option value="mujer">Mujer</option>
          <option value="rebajas">Rebajas</option>
        </select>

        <h4 style={{ marginTop: '2rem' }}>🖼 Fotos (URLs):</h4>
        {fotos.map((foto, i) => (
          <div key={i} style={{ marginBottom: '1rem' }}>
            <input
              value={foto}
              onChange={e => handleFotoChange(i, e.target.value)}
              placeholder={`Foto ${i + 1}`}
              style={{ width: '85%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            {i === fotos.length - 1 && (
              <button
                onClick={() => setFotos([...fotos, ''])}
                style={{
                  marginLeft: '0.5rem',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: '#2196f3',
                  color: 'white'
                }}
              >
                ➕
              </button>
            )}
          </div>
        ))}

        <button
          onClick={actualizarProducto}
          style={{
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            padding: '0.8rem 1.5rem',
            borderRadius: '5px',
            marginTop: '2rem',
            width: '100%',
            fontSize: '1rem'
          }}
        >
          💾 Guardar cambios
        </button>

        {mensaje && <p style={{ marginTop: '1rem', color: '#4caf50' }}>{mensaje}</p>}
      </div>
    </div>
  )
}

export default EditarProducto
