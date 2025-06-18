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

  const esEmailValido = (correo) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
  }

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
    <div style={{ padding: '2rem' }}>
      <h2>Crear cuenta</h2>

      <input
        placeholder="Nombre completo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Contraseña (mínimo 6 caracteres)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={registrar} disabled={cargando}>
        {cargando ? 'Registrando...' : 'Registrarse'}
      </button>

      {mensaje && (
        <p style={{ marginTop: '1rem', color: mensaje.includes('✅') ? 'green' : 'red' }}>
          {mensaje}
        </p>
      )}
    </div>
  )
}

export default Register
