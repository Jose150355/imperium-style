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
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: 'white' }}>Mis pedidos</h2>
      {pedidos.map(p => (
        <div key={p.id} style={{ backgroundColor: 'white', padding: '1rem', marginBottom: '1rem', borderRadius: '10px' }}>
          <p style={{ color: '#000' }}>
            <strong>📅 Fecha:</strong>{' '}
            {p.fecha?.toDate ? p.fecha.toDate().toLocaleString() : 'Sin fecha'}
          </p>
          <p style={{ color: '#000' }}><strong>⏳ Estado:</strong> {p.estado || 'Pendiente'}</p>
          <p style={{ color: '#000' }}><strong>💳 Método de pago:</strong> {p.metodoPago || 'No especificado'}</p>
          <p style={{ color: '#000' }}><strong>🛍 Productos:</strong></p>
          <ul>
            {p.productos?.map((prod, index) => (
              <li key={index} style={{ color: '#000' }}>{prod.title} – ${prod.price}</li>
            ))}
          </ul>
          {p.estado === 'enviado' && (
            <>
              <p style={{ color: '#000' }}><strong>🚚 Paquetería:</strong> {p.paqueteria || 'No especificada'}</p>
              <p style={{ color: '#000' }}><strong>📄 Número de guía:</strong> {p.guia || 'No disponible'}</p>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default MisPedidos
