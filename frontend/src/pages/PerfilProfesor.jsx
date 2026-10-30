
import { useEffect, useState } from 'react'

function PerfilProfesor({ perfilInicial }) {
  const [editando, setEditando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const obtenerPerfil = () => ({
    nombre: perfilInicial?.nombre || '',
    apellido: perfilInicial?.apellido || '',
    email: perfilInicial?.email || '',
    materias: perfilInicial?.materias || '',
    presentacion: perfilInicial?.presentacion || '',
    experiencia: perfilInicial?.experiencia || ''
  })

  const [perfil, setPerfil] = useState(obtenerPerfil)
  const [formulario, setFormulario] = useState(obtenerPerfil)

  useEffect(() => {
    const nuevoPerfil = obtenerPerfil()
    setPerfil(nuevoPerfil)
    setFormulario(nuevoPerfil)
    setEditando(false)
    setMensaje('')
  }, [perfilInicial])

  const manejarCambio = (e) => {
    const { name, value } = e.target

    setFormulario((previo) => ({
      ...previo,
      [name]: value
    }))
  }

  const guardarCambios = (e) => {
    e.preventDefault()

    setPerfil({ ...formulario })
    setEditando(false)
    setMensaje('¡Tu perfil docente se actualizó correctamente!')

    setTimeout(() => setMensaje(''), 3000)
  }

  const cancelarEdicion = () => {
    setFormulario({ ...perfil })
    setEditando(false)
    setMensaje('')
  }

  const iniciales =
    `${perfil.nombre.charAt(0)}${perfil.apellido.charAt(0)}`.toUpperCase()

  return (
    <div className="perfil-pagina">
      <div className="perfil-contenedor">
        <header className="perfil-encabezado">
          <div>
            <span className="perfil-etiqueta">MI CUENTA DOCENTE</span>
            <h1 className="perfil-titulo">Mi perfil de profesor</h1>
            <p className="perfil-subtitulo">
              Presentá tu experiencia y administrá la información de tus clases.
            </p>
          </div>

          {!editando && (
            <button
              type="button"
              className="btn-primario perfil-editar-btn"
              onClick={() => {
                setFormulario({ ...perfil })
                setEditando(true)
                setMensaje('')
              }}
            >
              Editar perfil
            </button>
          )}
        </header>

        {mensaje && (
          <p className="perfil-mensaje" role="status">
            {mensaje}
          </p>
        )}

        <section className="perfil-tarjeta">
          <div className="perfil-resumen">
            <div className="perfil-avatar">
              {iniciales || 'P'}
            </div>

            <div className="perfil-resumen-info">
              <h2>
                {perfil.nombre} {perfil.apellido}
              </h2>
              <p>{perfil.email}</p>
              <span className="perfil-rol">Profesor</span>
            </div>
          </div>

          <div className="perfil-separador" />

          <form className="perfil-formulario" onSubmit={guardarCambios}>
            <h3>Información personal y profesional</h3>

            <div className="perfil-grid">
              <div className="registro-campo">
                <label htmlFor="profesor-nombre">Nombre</label>
                <input
                  id="profesor-nombre"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  disabled={!editando}
                  required
                />
              </div>

              <div className="registro-campo">
                <label htmlFor="profesor-apellido">Apellido</label>
                <input
                  id="profesor-apellido"
                  name="apellido"
                  value={formulario.apellido}
                  onChange={manejarCambio}
                  disabled={!editando}
                  required
                />
              </div>

              <div className="registro-campo perfil-campo-completo">
                <label htmlFor="profesor-email">Correo electrónico</label>
                <input
                  id="profesor-email"
                  name="email"
                  type="email"
                  value={formulario.email}
                  onChange={manejarCambio}
                  disabled={!editando}
                  required
                />
              </div>

              <div className="registro-campo perfil-campo-completo">
                <label htmlFor="profesor-materias">
                  Materias que enseñás
                </label>
                <input
                  id="profesor-materias"
                  name="materias"
                  value={formulario.materias}
                  onChange={manejarCambio}
                  disabled={!editando}
                  placeholder="Ej.: Matemática, Física, Programación"
                  required
                />
              </div>

              <div className="registro-campo perfil-campo-completo">
                <label htmlFor="profesor-presentacion">
                  Presentación profesional
                </label>
                <textarea
                  id="profesor-presentacion"
                  name="presentacion"
                  value={formulario.presentacion}
                  onChange={manejarCambio}
                  disabled={!editando}
                  rows={4}
                  placeholder="Contanos sobre tu forma de enseñar."
                  required
                />
              </div>

              <div className="registro-campo perfil-campo-completo">
                <label htmlFor="profesor-experiencia">
                  Experiencia y formación
                </label>
                <textarea
                  id="profesor-experiencia"
                  name="experiencia"
                  value={formulario.experiencia}
                  onChange={manejarCambio}
                  disabled={!editando}
                  rows={3}
                  placeholder="Describí tu experiencia o formación."
                />
              </div>
            </div>

            {editando && (
              <div className="perfil-acciones">
                <button
                  type="button"
                  className="btn-secundario"
                  onClick={cancelarEdicion}
                >
                  Cancelar
                </button>

                <button type="submit" className="btn-primario">
                  Guardar cambios
                </button>
              </div>
            )}
          </form>
        </section>

        <p className="perfil-nota">
          Los datos son temporales: por ahora, los cambios no se guardan
          permanentemente ni están asociados a una cuenta real.
        </p>
      </div>
    </div>
  )
}

export default PerfilProfesor
