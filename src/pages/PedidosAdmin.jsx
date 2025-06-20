import { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'

function PedidosAdmin() {
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    const obtenerPedidos = async () => {
      const snapshot = await getDocs(collection(db, 'pedidos'))
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setPedidos(data)
    }

    obtenerPedidos()
  }, [])

  const actualizarEstado = async (id, nuevoEstado) => {
    await updateDoc(doc(db, 'pedidos', id), { estado: nuevoEstado })
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p))
  }

  const actualizarCampo = async (id, campo, valor) => {
    await updateDoc(doc(db, 'pedidos', id), { [campo]: valor })
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, [campo]: valor } : p))
  }

  const eliminarPedido = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este pedido?')) {
      await deleteDoc(doc(db, 'pedidos', id))
      setPedidos(prev => prev.filter(p => p.id !== id))
    }
  }

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: 'var(--color-principal)',
      minHeight: '100vh',
      color: 'var(--color-secundario)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>🛠️ Admin – Gestión de Pedidos</h2>

      {pedidos.length === 0 && <p style={{ textAlign: 'center' }}>No hay pedidos registrados.</p>}

      {pedidos.map((p) => (
        <div
          key={p.id}
          style={{
            background: '#1a1a1a',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 0 12px rgba(255,255,255,0.08)',
            marginBottom: '2rem'
          }}
        >
          <p><strong>📅 Fecha:</strong> {p.fecha?.seconds ? new Date(p.fecha.seconds * 1000).toLocaleString() : 'Sin fecha'}</p>
          <p><strong>👤 UID:</strong> {p.uid || 'Sin UID'}</p>
          <p><strong>📛 Nombre:</strong> {p.nombre || 'Sin nombre'}</p>
          <p><strong>📞 Teléfono:</strong> {p.telefono || 'Sin teléfono'}</p>
          <p><strong>📍 Dirección:</strong> {p.direccion || 'Sin dirección'}</p>
          <p><strong>🏙️ Ciudad:</strong> {p.ciudad || 'Sin ciudad'}</p>
          <p><strong>🌎 Estado:</strong> {p.estadoEnvio || 'Sin estado'}</p>
          <p><strong>📮 Código Postal:</strong> {p.postal || 'Sin CP'}</p>
          <p><strong>🗺️ Referencias:</strong> {p.referencias || 'Ninguna'}</p>
          <p><strong>💳 Método de pago:</strong> {p.metodoPago || 'No especificado'}</p>

          <p><strong>📦 Productos:</strong></p>
          <ul>
            {Array.isArray(p.productos) && p.productos.length > 0 ? (
              p.productos.map((prod, i) => (
                <li key={i}>{prod?.title || 'Sin título'} – ${prod?.price || '0'}</li>
              ))
            ) : (
              <li>Sin productos</li>
            )}
          </ul>

          <div style={{ marginTop: '1rem' }}>
            <p><strong>⚙️ Estado:</strong></p>
            <select
              value={p.estado || 'pendiente'}
              onChange={(e) => actualizarEstado(p.id, e.target.value)}
              style={selectStyle}
            >
              <option value="pendiente">Pendiente</option>
              <option value="aceptado">Aceptado</option>
              <option value="enviado">Enviado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          {(p.estado === 'aceptado' || p.estado === 'enviado') && (
            <div style={{ marginTop: '1rem' }}>
              <label><strong>🚚 Paquetería:</strong></label>
              <input
                type="text"
                placeholder="Ej. DHL, FedEx..."
                value={p.paqueteria || ''}
                onChange={(e) => actualizarCampo(p.id, 'paqueteria', e.target.value)}
                style={inputStyle}
              />

              <label><strong>📄 Número de guía:</strong></label>
              <input
                type="text"
                placeholder="Ej. 123456789"
                value={p.guia || ''}
                onChange={(e) => actualizarCampo(p.id, 'guia', e.target.value)}
                style={inputStyle}
              />
            </div>
          )}

          <button
            onClick={() => eliminarPedido(p.id)}
            style={{
              marginTop: '1rem',
              backgroundColor: '#f44336',
              color: 'white',
              padding: '0.7rem 1.2rem',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🗑️ Eliminar pedido
          </button>
        </div>
      ))}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '0.6rem',
  marginBottom: '0.8rem',
  borderRadius: '6px',
  border: '1px solid #555',
  background: '#000',
  color: 'white'
}

const selectStyle = {
  width: '100%',
  padding: '0.6rem',
  borderRadius: '6px',
  border: '1px solid #555',
  background: '#000',
  color: 'white'
}

export default PedidosAdmin
