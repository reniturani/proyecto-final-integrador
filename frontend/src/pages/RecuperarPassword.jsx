
import { useState } from 'react'

function RecuperarPassword({ onNavegar }) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    // La conexión con el backend se agregará cuando esté disponible.
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

        <button type="submit" className="btn-primario">
          Recuperar contraseña
        </button>

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
