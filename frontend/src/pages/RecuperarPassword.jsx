
import { useState } from 'react'

function RecuperarPassword({ onNavegar }) {
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
      const respuesta = await fetch(
        'http://localhost:3000/api/auth/forgot-password',
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
