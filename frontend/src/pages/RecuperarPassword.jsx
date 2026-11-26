
import { useState } from 'react'

function RecuperarPassword({ onNavegar, setTokenRecuperacion }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [token, setToken] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setMensaje('')
    setToken('')
    setCargando(true)

    try {
      // Recuperación local para cuentas de demostración
const cuentasDemo = {
    'estudiante.prueba@profy.com': 'estudiante',
    'profesor.prueba@profy.com': 'profesor'
}

const emailNormalizado = email.trim().toLowerCase()
const tipoDemo = cuentasDemo[emailNormalizado]

if (tipoDemo) {
    const tokenDemo = `demo-${tipoDemo}-${Date.now()}`

    localStorage.setItem(
        'recuperacionDemo',
        JSON.stringify({
            email: emailNormalizado,
            tipo: tipoDemo,
            token: tokenDemo,
            expiraEn: Date.now() + 15 * 60 * 1000 // 15 minutos
        })
    )

    setMensaje(
        'Cuenta de demostración encontrada. Utilizá el código que aparece abajo para continuar.'
    )

    setToken(tokenDemo)
    setTokenRecuperacion(tokenDemo)
    return
}
      const respuesta = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        }
      )

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al solicitar recuperación')
      }

      setMensaje(datos.mensaje)
      setToken(datos.token || '')
      setTokenRecuperacion(datos.token || '')

    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="page-container pantalla-centrada">
      <h1 className="page-title">
        Recuperar <span className="highlight">contraseña</span>
      </h1>

      <form className="formulario" onSubmit={handleSubmit}>
        <p>
          Ingresá tu correo electrónico para iniciar el proceso de
          recuperación de tu contraseña.
        </p>

        {error && (
          <div style={{
            color: 'var(--color-terracotta)',
            background: '#ffe9e9',
            padding: '10px',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {mensaje && (
          <div style={{
            color: 'green',
            background: '#e9f7e9',
            padding: '10px',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            {mensaje}
          </div>
        )}

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primario"
          disabled={cargando}
        >
          {cargando ? 'Procesando...' : 'Recuperar contraseña'}
        </button>

        {token && (
          <div className="input-group" style={{ marginTop: '16px' }}>
            <label>Token de recuperación (prueba)</label>
            <input
              type="text"
              value={token}
              readOnly
            />
            <small>
              Guardá este token para utilizarlo en el siguiente paso.
            </small>
          </div>
          
        )}
        {token && (
  <button
    type="button"
    className="btn-primario"
    onClick={() => onNavegar('Restablecer contraseña')}
    style={{ marginTop: '12px' }}
  >
    Continuar
  </button>
)}

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            type="button"
            className="registro-enlace"
            onClick={() => onNavegar('Login')}
          >
            Volver al inicio de sesión
          </button>
        </div>
      </form>
    </div>
  )
}

export default RecuperarPassword
