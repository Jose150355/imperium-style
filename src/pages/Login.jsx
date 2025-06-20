import { useState } from 'react'
import { auth } from '../firebase'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [recuperarEmail, setRecuperarEmail] = useState('')
  const [mensajeRecuperar, setMensajeRecuperar] = useState('')

  const navigate = useNavigate()

  const iniciarSesion = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setMensaje('✅ Sesión iniciada')
      navigate('/')
    } catch (err) {
      setMensaje('❌ Error: ' + err.message)
    }
  }

  const recuperarContrasena = async () => {
    try {
      await sendPasswordResetEmail(auth, recuperarEmail)
      setMensajeRecuperar('📧 Revisa tu correo para restablecer la contraseña.')
    } catch (err) {
      setMensajeRecuperar('❌ Error: ' + err.message)
    }
  }

  return (
    <div style={{
      backgroundColor: 'var(--color-principal)',
      color: 'var(--color-secundario)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '2rem',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 0 20px rgba(255,255,255,0.05)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>🔐 Iniciar sesión</h2>

        <input
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '0.7rem',
            borderRadius: '8px',
            border: '1px solid #888',
            marginBottom: '1rem',
            background: '#000',
            color: 'white'
          }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '0.7rem',
            borderRadius: '8px',
            border: '1px solid #888',
            marginBottom: '1.5rem',
            background: '#000',
            color: 'white'
          }}
        />
        <button
          onClick={iniciarSesion}
          style={{
            width: '100%',
            padding: '0.8rem',
            borderRadius: '8px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          ✅ Iniciar sesión
        </button>
        {mensaje && <p style={{ marginTop: '1rem', color: '#4caf50' }}>{mensaje}</p>}

        <hr style={{ margin: '2rem 0', borderColor: '#555' }} />

        <h4 style={{ marginBottom: '0.5rem' }}>¿Olvidaste tu contraseña?</h4>
        <input
          placeholder="Tu correo para recuperar"
          value={recuperarEmail}
          onChange={(e) => setRecuperarEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '0.7rem',
            borderRadius: '8px',
            border: '1px solid #888',
            background: '#000',
            color: 'white',
            marginBottom: '1rem'
          }}
        />
        <button
          onClick={recuperarContrasena}
          style={{
            width: '100%',
            padding: '0.8rem',
            borderRadius: '8px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            fontWeight: 'bold'
          }}
        >
          📧 Enviar correo de recuperación
        </button>
        {mensajeRecuperar && <p style={{ marginTop: '1rem', color: '#2196f3' }}>{mensajeRecuperar}</p>}
      </div>
    </div>
  )
}

export default Login
