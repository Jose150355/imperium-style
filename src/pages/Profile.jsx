import { useState } from 'react'
import { auth } from '../firebase'
import { updatePassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const user = auth.currentUser
  const [nombre, setNombre] = useState('')
  const [nuevaContrasena, setNuevaContrasena] = useState('')
  const [mensaje, setMensaje] = useState('')
  const navigate = useNavigate()

  const cambiarContrasena = async () => {
    try {
      await updatePassword(user, nuevaContrasena)
      setMensaje('✅ Contraseña actualizada')
      setNuevaContrasena('')
    } catch {
      setMensaje('❌ Error al cambiar contraseña')
    }
  }

  const cerrarSesion = async () => {
    await auth.signOut()
    navigate('/login')
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: 'var(--color-principal)', color: 'var(--color-secundario)', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>👤 Mi perfil</h2>

      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <p><strong>Correo electrónico:</strong> {user?.email}</p>

        <div style={{ marginTop: '2rem' }}>
          <label>📝 Nombre completo:</label><br />
          <input
            placeholder="Tu nombre completo"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              marginTop: '0.5rem',
              marginBottom: '1rem'
            }}
          />
          <button style={{
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '5px'
          }}>
            Guardar nombre
          </button>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <label>🔒 Nueva contraseña:</label><br />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nuevaContrasena}
            onChange={e => setNuevaContrasena(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              marginTop: '0.5rem',
              marginBottom: '1rem'
            }}
          />
          <button onClick={cambiarContrasena} style={{
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '5px'
          }}>
            Cambiar contraseña
          </button>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button onClick={cerrarSesion} style={{
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '5px'
          }}>
            🚪 Cerrar sesión
          </button>
        </div>

        {mensaje && <p style={{ marginTop: '1.5rem', color: '#4caf50' }}>{mensaje}</p>}
      </div>
    </div>
  )
}

export default Profile
