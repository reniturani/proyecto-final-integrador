import { useEffect, useState } from 'react'

function MiPerfil({ perfilInicial }) {
  const [editando, setEditando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const [perfil, setPerfil] = useState(() => ({
    nombre: perfilInicial?.nombre || '',
    apellido: perfilInicial?.apellido || '',
    email: perfilInicial?.email || '',
    materias: perfilInicial?.materias || '',
    presentacion: perfilInicial?.presentacion || ''
  }))

  const [formulario, setFormulario] = useState(perfil)

  useEffect(() => {
    const nuevoPerfil = {
      nombre: perfilInicial?.nombre || '',
      apellido: perfilInicial?.apellido || '',
      email: perfilInicial?.email || '',
      materias: perfilInicial?.materias || '',
      presentacion: perfilInicial?.presentacion || ''
    }

    setPerfil(nuevoPerfil)
    setFormulario(nuevoPerfil)
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
    setMensaje('¡Tu perfil se actualizó correctamente!')

    setTimeout(() => setMensaje(''), 3000)
  }

  const cancelarEdicion = () => {
    setFormulario({ ...perfil })
    setEditando(false)
    setMensaje('')
  }

  const iniciales = (
    `${perfil.nombre.charAt(0)}${perfil.apellido.charAt(0)}`
  ).toUpperCase()

  return (
    <div className="perfil-pagina">
      <div className="perfil-contenedor">
        <header className="perfil-encabezado">
          <div>
            <span className="perfil-etiqueta">MI CUENTA</span>

            <h1 className="perfil-titulo">Mi perfil</h1>

            <p className="perfil-subtitulo">
              Administrá tu información personal y tus intereses de aprendizaje.
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
              {iniciales || '?'}
            </div>

            <div className="perfil-resumen-info">
              <h2>
                {perfil.nombre} {perfil.apellido}
              </h2>

              <p>{perfil.email}</p>

              <span className="perfil-rol">Estudiante</span>
            </div>
          </div>

          <div className="perfil-separador" />

          <form
            className="perfil-formulario"
            onSubmit={guardarCambios}
          >
            <h3>Información personal</h3>

            <div className="perfil-grid">
              <div className="registro-campo">
                <label htmlFor="perfil-nombre">Nombre</label>

                <input
                  id="perfil-nombre"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  disabled={!editando}
                  required
                />
              </div>

              <div className="registro-campo">
                <label htmlFor="perfil-apellido">Apellido</label>

                <input
                  id="perfil-apellido"
                  name="apellido"
                  value={formulario.apellido}
                  onChange={manejarCambio}
                  disabled={!editando}
                  required
                />
              </div>

              <div className="registro-campo perfil-campo-completo">
                <label htmlFor="perfil-email">
                  Correo electrónico
                </label>

                <input
                  id="perfil-email"
                  name="email"
                  type="email"
                  value={formulario.email}
                  onChange={manejarCambio}
                  disabled={!editando}
                  required
                />
              </div>

              <div className="registro-campo perfil-campo-completo">
                <label htmlFor="perfil-materias">
                  Materias que te interesa aprender
                </label>

                <input
                  id="perfil-materias"
                  name="materias"
                  value={formulario.materias}
                  onChange={manejarCambio}
                  disabled={!editando}
                  placeholder="Ej.: Programación, Matemática"
                />
              </div>

              <div className="registro-campo perfil-campo-completo">
                <label htmlFor="perfil-presentacion">
                  Sobre mí
                </label>

                <textarea
                  id="perfil-presentacion"
                  name="presentacion"
                  value={formulario.presentacion}
                  onChange={manejarCambio}
                  disabled={!editando}
                  rows={4}
                  placeholder="Contanos sobre tus intereses y objetivos."
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

                <button
                  type="submit"
                  className="btn-primario"
                >
                  Guardar cambios
                </button>
              </div>
            )}
          </form>
        </section>

        <p className="perfil-nota">
          Los cambios se mantienen temporalmente mientras la aplicación
          está abierta. Todavía no se guardan permanentemente.
        </p>
      </div>
    </div>
  )
}

export default MiPerfil