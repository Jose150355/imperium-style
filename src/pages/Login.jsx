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
    <div style={{ padding: '2rem' }}>
      <h2>Iniciar sesión</h2>
      <input
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />
      <button onClick={iniciarSesion}>Iniciar sesión</button>
      {mensaje && <p style={{ marginTop: '1rem' }}>{mensaje}</p>}

      <hr style={{ margin: '2rem 0' }} />

      <h4>¿Olvidaste tu contraseña?</h4>
      <input
        placeholder="Tu correo para recuperar"
        value={recuperarEmail}
        onChange={(e) => setRecuperarEmail(e.target.value)}
      />
      <br /><br />
      <button onClick={recuperarContrasena}>Enviar correo de recuperación</button>
      {mensajeRecuperar && <p>{mensajeRecuperar}</p>}
    </div>
  )
}

export default Login
