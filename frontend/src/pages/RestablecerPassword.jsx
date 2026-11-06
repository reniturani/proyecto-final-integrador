
import { useState } from 'react'

function RestablecerPassword({ onNavegar }) {
  const [token, setToken] = useState('')
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setMensaje('')

    if (nuevaPassword !== confirmarPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (nuevaPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setCargando(true)

    try {
      const respuesta = await fetch(
        'http://localhost:3000/api/auth/reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token,
            nuevaPassword
          })
        }
      )

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al cambiar la contraseña')
      }

      setMensaje(datos.mensaje)
      setToken('')
      setNuevaPassword('')
      setConfirmarPassword('')

    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="page-container pantalla-centrada">
      <h1 className="page-title">
        Nueva <span className="highlight">contraseña</span>
      </h1>

      <form className="formulario" onSubmit={handleSubmit}>
        <p>
          Ingresá el token que recibiste y elegí tu nueva contraseña.
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
          <label>Token de recuperación</label>
          <input
            type="text"
            placeholder="Pegá tu token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Nueva contraseña</label>
          <input
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>

        <div className="input-group">
          <label>Confirmar contraseña</label>
          <input
            type="password"
            placeholder="Repetí tu contraseña"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primario"
          disabled={cargando}
        >
          {cargando ? 'Actualizando...' : 'Cambiar contraseña'}
        </button>

        {mensaje && (
          <button
            type="button"
            className="registro-enlace"
            onClick={() => onNavegar('Login')}
            style={{ marginTop: '16px' }}
          >
            Volver al inicio de sesión
          </button>
        )}
      </form>
    </div>
  )
}

export default RestablecerPassword
