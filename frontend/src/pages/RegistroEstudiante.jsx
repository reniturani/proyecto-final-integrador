import { useState, useEffect } from 'react'
import { obtenerMaterias } from '../services/materias'

function RegistroEstudiante({ onNavegar }) {
  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmarPassword: '',
    materias:[],
    presentacion: ''
  })

  const [materiasDisponibles, setMateriasDisponibles] = useState([])

useEffect(() => {
  async function cargarMaterias() {
    try {
      const respuesta = await obtenerMaterias({
        pagina: 1,
        limite: 100
      })

      setMateriasDisponibles(respuesta.datos || [])
    } catch (error) {
      console.error('Error al cargar materias:', error)
    }
  }

  cargarMaterias()
}, [])

  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const manejarCambio = (e) => {
    const { name, value } = e.target

    setFormulario((previo) => ({
      ...previo,
      [name]: value
    }))
  }

  const manejarEnvio = (e) => {
    e.preventDefault()
    setError('')
    setMensaje('')
    

    if (formulario.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    if (formulario.password !== formulario.confirmarPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    // Compartimos los datos del estudiante con App.jsx.
    // No enviamos la contraseña al perfil.
    
    localStorage.setItem('usuarioRol', 'estudiante')
    
    onNavegar('Mi perfil', {
      nombre: formulario.nombre,
      apellido: formulario.apellido,
      email: formulario.email,
      materias: formulario.materias,
      presentacion: formulario.presentacion,
      rol: 'estudiante'
    })
  }

  return (
    <div className="registro-pagina">
      <div className="registro-tarjeta registro-tarjeta-profesor">
        <h1 className="registro-titulo">
          Crear cuenta de estudiante
        </h1>

        <p className="registro-descripcion">
          Registrate para comenzar tu camino de aprendizaje.
        </p>

        <form
          className="registro-formulario"
          onSubmit={manejarEnvio}
        >
          <div className="registro-campo">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              placeholder="Tu nombre"
              autoComplete="given-name"
              required
            />
          </div>

          <div className="registro-campo">
            <label htmlFor="apellido">Apellido</label>
            <input
              id="apellido"
              name="apellido"
              value={formulario.apellido}
              onChange={manejarCambio}
              placeholder="Tu apellido"
              autoComplete="family-name"
              required
            />
          </div>

          <div className="registro-campo">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formulario.email}
              onChange={manejarCambio}
              placeholder="ejemplo@correo.com"
              autoComplete="email"
              required
            />
          </div>

        <div className="registro-campo registro-campo-completo">
  <label>Materias que te interesa aprender</label>

  <div className="registro-materias">
    {materiasDisponibles.map((materia) => (
      <label key={materia.id_materia}>
        <input
          type="checkbox"
          checked={formulario.materias.includes(materia.id_materia)}
          onChange={(e) => {
            const id = materia.id_materia

            setFormulario((previo) => ({
              ...previo,
              materias: e.target.checked
                ? [...previo.materias, id]
                : previo.materias.filter((m) => m !== id)
            }))
          }}
        />

        {materia.nombre}
      </label>
    ))}
  </div>
</div>

<div className="registro-campo registro-campo-completo">
  <label htmlFor="presentacion">
    Sobre mí
  </label>

  <textarea
    id="presentacion"
    name="presentacion"
    value={formulario.presentacion}
    onChange={manejarCambio}
    placeholder="Contanos sobre tus intereses y objetivos de aprendizaje."
    rows={4}
  />
</div>

          <div className="registro-campo">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formulario.password}
              onChange={manejarCambio}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div className="registro-campo">
            <label htmlFor="confirmarPassword">
              Confirmar contraseña
            </label>
            <input
              id="confirmarPassword"
              name="confirmarPassword"
              type="password"
              value={formulario.confirmarPassword}
              onChange={manejarCambio}
              placeholder="Repetí tu contraseña"
              autoComplete="new-password"
              required
            />
          </div>

          {error && (
            <p className="registro-error" role="alert">
              {error}
            </p>
          )}

          {mensaje && (
            <p className="registro-exito" role="status">
              {mensaje}
            </p>
          )}

          <button
            type="submit"
            className="btn-primario registro-boton"
          >
            Crear cuenta
          </button>

          <p className="registro-pie">
            ¿Ya tenés una cuenta?{' '}
            <button
              type="button"
              className="registro-enlace"
              onClick={() => onNavegar('Login')}
            >
              Iniciar sesión
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default RegistroEstudiante