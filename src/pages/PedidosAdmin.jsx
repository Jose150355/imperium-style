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
    <div style={{ padding: '2rem' }}>
      <h2>🛠️ Admin - Gestión de Pedidos</h2>

      {pedidos.length === 0 && <p>No hay pedidos registrados.</p>}

      {pedidos.map((p) => (
        <div
          key={p.id}
          style={{
            background: 'black',
            padding: '1rem',
            marginBottom: '2rem',
            borderRadius: '10px',
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

          <p><strong>⚙️ Estado:</strong>
            <select
              value={p.estado || 'pendiente'}
              onChange={(e) => actualizarEstado(p.id, e.target.value)}
              style={{ marginLeft: '0.5rem' }}
            >
              <option value="pendiente">Pendiente</option>
              <option value="aceptado">Aceptado</option>
              <option value="enviado">Enviado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </p>

          {(p.estado === 'aceptado' || p.estado === 'enviado') && (
            <>
              <p><strong>🚚 Paquetería:</strong></p>
              <input
                type="text"
                placeholder="Ej. DHL, FedEx..."
                value={p.paqueteria || ''}
                onChange={(e) => actualizarCampo(p.id, 'paqueteria', e.target.value)}
                style={{ width: '100%', marginBottom: '0.5rem' }}
              />

              <p><strong>📄 Número de guía:</strong></p>
              <input
                type="text"
                placeholder="Ej. 123456789"
                value={p.guia || ''}
                onChange={(e) => actualizarCampo(p.id, 'guia', e.target.value)}
                style={{ width: '100%' }}
              />
            </>
          )}

          <button
            onClick={() => eliminarPedido(p.id)}
            style={{
              marginTop: '1rem',
              backgroundColor: '#f44336',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '5px',
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

export default PedidosAdmin
