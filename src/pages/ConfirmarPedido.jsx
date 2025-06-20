import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

function ConfirmarPedido() {
  const [productos, setProductos] = useState([])
  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [telefono, setTelefono] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [estado, setEstado] = useState('')
  const [postal, setPostal] = useState('')
  const [referencias, setReferencias] = useState('')
  const [metodoPago, setMetodoPago] = useState('Tarjeta de débito')
  const [usuario, setUsuario] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const guardados = localStorage.getItem('productosSeleccionados')
    if (guardados) {
      setProductos(JSON.parse(guardados))
    }

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) setUsuario(user)
    })

    return () => unsubscribe()
  }, [])

  const quitarProducto = (id) => {
    const nuevos = productos.filter(p => p.id !== id)
    setProductos(nuevos)
    localStorage.setItem('productosSeleccionados', JSON.stringify(nuevos))
  }

  const confirmar = async () => {
    if (!nombre || !direccion || !telefono || !ciudad || !estado || !postal) {
      alert('❌ Por favor llena todos los campos obligatorios.')
      return
    }

    if (!usuario) {
      alert('❌ Debes iniciar sesión para confirmar el pedido.')
      return
    }

    try {
      await addDoc(collection(db, 'pedidos'), {
        uid: usuario.uid,
        productos,
        nombre,
        direccion,
        telefono,
        ciudad,
        estadoEnvio: estado,
        postal,
        referencias,
        metodoPago,
        estado: 'pendiente',
        fecha: serverTimestamp()
      })

      localStorage.removeItem('productosSeleccionados')
      alert('✅ Pedido confirmado. ¡Gracias por tu compra!')
      navigate('/')
    } catch (error) {
      alert('❌ Error al guardar el pedido: ' + error.message)
    }
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: 'var(--color-principal)', color: 'var(--color-secundario)', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>🧾 Confirmar pedido</h2>

      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h4>🛍 Tu orden:</h4>
        <ul style={{ paddingLeft: '1rem' }}>
          {productos.map(p => (
            <li key={p.id} style={{ marginBottom: '0.5rem' }}>
              {p.title} – ${p.price}
              <button
                onClick={() => quitarProducto(p.id)}
                style={{
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  marginLeft: '1rem',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                ❌ Eliminar
              </button>
            </li>
          ))}
        </ul>

        <h4 style={{ marginTop: '2rem' }}>📦 Datos de envío</h4>
        <input placeholder="Nombre completo" value={nombre} onChange={e => setNombre(e.target.value)} /><br />
        <input placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} /><br />
        <input placeholder="Dirección (calle, número)" value={direccion} onChange={e => setDireccion(e.target.value)} /><br />
        <input placeholder="Ciudad" value={ciudad} onChange={e => setCiudad(e.target.value)} /><br />
        <input placeholder="Estado" value={estado} onChange={e => setEstado(e.target.value)} /><br />
        <input placeholder="Código Postal" value={postal} onChange={e => setPostal(e.target.value)} /><br />
        <textarea placeholder="Referencias (opcional)" value={referencias} onChange={e => setReferencias(e.target.value)} /><br />

        <h4 style={{ marginTop: '2rem' }}>💳 Método de pago:</h4>
        <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)} style={{ padding: '0.5rem', marginBottom: '1.5rem' }}>
          <option>Tarjeta de débito</option>
          <option>Tarjeta de crédito</option>
          <option>PayPal</option>
        </select><br />

        <button
          onClick={confirmar}
          style={{
            backgroundColor: '#4caf50',
            color: 'white',
            padding: '0.8rem 1.5rem',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '5px',
            width: '100%'
          }}
        >
          ✅ Confirmar pedido
        </button>
      </div>
    </div>
  )
}

export default ConfirmarPedido
