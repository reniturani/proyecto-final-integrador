import { useState } from 'react'
import { obtenerMaterias } from '../services/materias'

function RegistroProfesor({ onNavegar }) {
  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmarPassword: '',
    materias: [],
    modalidad: '',
    presentacion: ''
  })
  const [materiasDisponibles, setMateriasDisponibles] = useState([])

  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
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

    // Enviamos los datos del profesor a App.jsx.
    // La contraseña no se comparte con el perfil.
    localStorage.setItem('usuarioRol', 'profesor')

    onNavegar('Mi perfil', {
      nombre: formulario.nombre,
      apellido: formulario.apellido,
      email: formulario.email,
      materias: formulario.materias,
      modalidad: formulario.modalidad,
      presentacion: formulario.presentacion,
      rol: 'profesor'
    })
  }

  return (
    <div className="registro-pagina">
      <div className="registro-tarjeta">
        <h1 className="registro-titulo">
          Crear cuenta de profesor
        </h1>

        <p className="registro-descripcion">
          Compartí tus conocimientos y conectá con nuevos estudiantes.
        </p>

        <form
          className="registro-formulario"
          onSubmit={manejarEnvio}
        >
          <div className="registro-campo">
    <label>Materias que enseñás</label>

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
<div className="registro-campo">
    <label htmlFor="modalidad">Modalidad de enseñanza</label>

    <select
        id="modalidad"
        name="modalidad"
        value={formulario.modalidad}
        onChange={manejarCambio}
        required
    >
        <option value="">Seleccioná una modalidad</option>
        <option value="Virtual">Virtual</option>
        <option value="Presencial">Presencial</option>
        <option value="Mixta">Mixta</option>
    </select>
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

          <div className="registro-campo">
            <label htmlFor="materias">Materias que enseñás</label>
            <input
              id="materias"
              name="materias"
              value={formulario.materias}
              onChange={manejarCambio}
              placeholder="Ej.: Matemática, Programación"
              required
            />
          </div>

          <div className="registro-campo">
            <label htmlFor="presentacion">
              Presentación profesional
            </label>
            <textarea
              id="presentacion"
              name="presentacion"
              value={formulario.presentacion}
              onChange={manejarCambio}
              placeholder="Contanos sobre tu experiencia y cómo enseñás"
              rows={4}
              required
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
            Crear cuenta de profesor
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

export default RegistroProfesor