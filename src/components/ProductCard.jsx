// src/components/ProductCard.jsx
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
        fotos: [imageUrl], // 👈 lo importante: array llamado 'fotos'
        createdAt: new Date()
    })

      alert('✅ Producto apartado exitosamente')
    } catch (err) {
      alert('❌ Error al apartar: ' + err.message)
    }
  }

  return (
    <div style={styles.card}>
      <img src={imageUrl} alt={title} style={styles.image} />
      <div style={styles.content}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.description}>{description}</p>
        <p style={styles.price}>${price}</p>
        <button style={styles.button} onClick={handleApartar}>
          Apartar
        </button>
      </div>
    </div>
  )
}

const styles = {
  card: {
    flex: '1 1 250px',
    maxWidth: '300px',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    margin: '1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.2s',
  },
  image: {
    width: '100%',
    height: '240px',
    objectFit: 'cover',
  },
  content: {
    padding: '1rem'
  },
  title: {
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
    fontWeight: 'bold'
  },
  description: {
    fontSize: '0.9rem',
    color: '#444',
    marginBottom: '0.5rem'
  },
  price: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '0.7rem'
  },
  button: {
    backgroundColor: 'black',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%'
  }
}

export default ProductCard
