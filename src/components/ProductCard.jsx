import { auth, db } from '../firebase'
import { addDoc, collection } from 'firebase/firestore'

function ProductCard({ title, description, price, imageUrl }) {
  const handleApartar = async () => {
    const user = auth.currentUser
    if (!user) {
      alert('Debes iniciar sesión para apartar productos.')
      return
    }

    try {
      await addDoc(collection(db, 'apartados'), {
        uid: user.uid,
        title,
        description,
        price,
        imageUrl,
        createdAt: new Date()
      })
      alert('Producto apartado exitosamente ✅')
    } catch (err) {
      alert('Error al apartar: ' + err.message)
    }
  }

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '10px',
      padding: '1rem',
      margin: '1rem',
      maxWidth: '250px',
      background: '#fff',
      color: '#000'
    }}>
      <img src={imageUrl} alt={title} style={{ width: '100%', borderRadius: '8px' }} />
      <h3>{title}</h3>
      <p>{description}</p>
      <strong>${price}</strong>
      <br /><br />
      <button onClick={handleApartar}>Apartar</button>
    </div>
  )
}

export default ProductCard
