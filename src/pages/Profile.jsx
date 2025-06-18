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
    <div style={{ padding: '2rem' }}>
      <h2>Mi perfil</h2>
      <p><strong>Correo:</strong> {user?.email}</p>

      <div style={{ marginTop: '1rem' }}>
        <label>Nombre:</label>
        <input
          placeholder="Tu nombre completo"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
        <button>Guardar nombre</button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label>Cambiar contraseña:</label>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nuevaContrasena}
          onChange={e => setNuevaContrasena(e.target.value)}
        />
        <button onClick={cambiarContrasena}>Cambiar contraseña</button>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <button onClick={cerrarSesion} style={{
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '5px'
        }}>
          🚪 Cerrar sesión
        </button>
      </div>

      {mensaje && <p style={{ marginTop: '1rem', color: 'green' }}>{mensaje}</p>}
    </div>
  )
}

export default Profile
