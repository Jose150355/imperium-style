import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

function MisPedidos() {
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    const obtenerPedidos = async (user) => {
      const q = query(collection(db, 'pedidos'), where('uid', '==', user.uid))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setPedidos(data)
    }

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) obtenerPedidos(user)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div style={{ padding: '2rem', backgroundColor: 'var(--color-principal)', minHeight: '100vh' }}>
      <h2 style={{ color: 'var(--color-secundario)', textAlign: 'center' }}>Mis pedidos</h2>

      {pedidos.length === 0 ? (
        <p style={{ color: 'var(--color-secundario)', textAlign: 'center', marginTop: '2rem' }}>
          No tienes pedidos registrados aún.
        </p>
      ) : (
        pedidos.map(p => (
          <div
            key={p.id}
            style={{
              backgroundColor: '#fff',
              color: '#000',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              maxWidth: 600,
              margin: '1.5rem auto'
            }}
          >
            <p><strong>📅 Fecha:</strong> {p.fecha?.toDate ? p.fecha.toDate().toLocaleString() : 'Sin fecha'}</p>
            <p><strong>⏳ Estado:</strong> {p.estado || 'Pendiente'}</p>
            <p><strong>💳 Método de pago:</strong> {p.metodoPago || 'No especificado'}</p>
            <p><strong>🛍 Productos:</strong></p>
            <ul style={{ paddingLeft: '1rem' }}>
              {p.productos?.map((prod, index) => (
                <li key={index}>{prod.title} – ${prod.price}</li>
              ))}
            </ul>
            {p.estado === 'enviado' && (
              <>
                <p><strong>🚚 Paquetería:</strong> {p.paqueteria || 'No especificada'}</p>
                <p><strong>📄 Número de guía:</strong> {p.guia || 'No disponible'}</p>
              </>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default MisPedidos
