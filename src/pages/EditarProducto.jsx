// src/pages/EditarProducto.jsx
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
    return <p style={{ padding: '2rem' }}>🚫 No tienes permiso para ver esta página</p>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Editar producto</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nombre del producto" />
      <br /><br />
      <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descripción" />
      <br /><br />
      <input value={price} onChange={e => setPrice(e.target.value)} type="number" placeholder="Precio" />
      <br /><br />
      <select value={categoria} onChange={e => setCategoria(e.target.value)}>
        <option value="hombre">Hombre</option>
        <option value="mujer">Mujer</option>
        <option value="rebajas">Rebajas</option>
      </select>
      <br /><br />
      <h4>Fotos (URLs de imagen):</h4>
      {fotos.map((foto, i) => (
        <div key={i}>
          <input
            value={foto}
            onChange={e => handleFotoChange(i, e.target.value)}
            placeholder={`Foto ${i + 1}`}
            style={{ width: '80%' }}
          />
          {i === fotos.length - 1 && (
            <button onClick={() => setFotos([...fotos, ''])}>➕</button>
          )}
        </div>
      ))}
      <br />
      <button onClick={actualizarProducto}>Guardar cambios</button>

      {mensaje && <p style={{ marginTop: '1rem', color: 'green' }}>{mensaje}</p>}
    </div>
  )
}

export default EditarProducto
