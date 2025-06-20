import { useState } from 'react'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const navigate = useNavigate()

  const esEmailValido = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)

  const registrar = async () => {
    if (!nombre || !email || !password || !confirmPassword) {
      setMensaje('❌ Llena todos los campos')
      return
    }

    if (!esEmailValido(email)) {
      setMensaje('❌ Ingresa un correo válido')
      return
    }

    if (password.length < 6) {
      setMensaje('❌ La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setMensaje('❌ Las contraseñas no coinciden')
      return
    }

    setCargando(true)

    try {
      const credencial = await createUserWithEmailAndPassword(auth, email, password)
      const uid = credencial.user.uid

      await setDoc(doc(db, 'usuarios', uid), {
        nombre,
        email,
        fechaRegistro: new Date()
      })

      setMensaje('✅ Cuenta creada correctamente')
      navigate('/')
    } catch (err) {
      setMensaje('❌ Error: ' + err.message)
    } finally {
      setCargando(false)
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
        maxWidth: '450px',
        boxShadow: '0 0 20px rgba(255,255,255,0.05)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>📝 Crear cuenta</h2>

        <input
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={registrar}
          disabled={cargando}
          style={{
            width: '100%',
            padding: '0.8rem',
            borderRadius: '8px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            marginTop: '1rem'
          }}
        >
          {cargando ? 'Registrando...' : '✅ Registrarse'}
        </button>

        {mensaje && (
          <p style={{
            marginTop: '1rem',
            color: mensaje.includes('✅') ? '#4caf50' : 'red',
            textAlign: 'center'
          }}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '0.7rem',
  borderRadius: '8px',
  border: '1px solid #888',
  marginBottom: '1rem',
  background: '#000',
  color: 'white'
}

export default Register
