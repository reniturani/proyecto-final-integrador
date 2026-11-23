import { useEffect, useState } from "react";
import { obtenerMaterias } from "../services/materias";

function PerfilProfesor({ perfilInicial, actualizarPerfil }) {
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [materiasDisponibles, setMateriasDisponibles] = useState([]);

  useEffect(() => {
    async function cargarMaterias() {
      try {
        const respuesta = await obtenerMaterias({
          pagina: 1,
          limite: 100,
        });

        setMateriasDisponibles(respuesta.datos || []);
      } catch (error) {
        console.error("Error al cargar materias:", error);
      }
    }

    cargarMaterias();
  }, []);

  const obtenerPerfil = () => ({
    nombre: perfilInicial?.nombre || "",
    apellido: perfilInicial?.apellido || "",
    email: perfilInicial?.email || "",

    materias: Array.isArray(perfilInicial?.materias)
      ? perfilInicial.materias.map(Number)
      : String(perfilInicial?.materias || "")
          .split(",")
          .map((id) => Number(id.trim()))
          .filter((id) => Number.isFinite(id) && id > 0),

    modalidad: perfilInicial?.modalidad || "",
    presentacion: perfilInicial?.presentacion || "",

    formacion: perfilInicial?.formacion || {
      universitario: {
        seleccionado: false,
        titulo: "",
        institucion: "",
      },
      terciario: {
        seleccionado: false,
        titulo: "",
        institucion: "",
      },
      cursos: {
        seleccionado: false,
        titulo: "",
        institucion: "",
      },
    },

    tieneExperiencia: perfilInicial?.tieneExperiencia ?? null,
    detalleExperiencia: perfilInicial?.detalleExperiencia || "",
  });

  const [perfil, setPerfil] = useState(obtenerPerfil);
  const [formulario, setFormulario] = useState(obtenerPerfil);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((previo) => ({
      ...previo,
      [name]: value,
    }));
  };
  const normalizarTexto = (texto) => {
    return texto
      .toLowerCase()
      .replace(/(^\s*[a-záéíóúüñ]|[.!?]\s+[a-záéíóúüñ])/g, (letra) =>
        letra.toUpperCase(),
      )
      .trim();
  };
  const validarFormacion = (texto) => {
    const valor = texto.trim();

    if (valor.length < 4) return false;

    const letras = valor.replace(/[^a-záéíóúüñ]/gi, "");

    if (letras.length === 0) return false;

    if (letras.length >= 3 && new Set(letras.toLowerCase()).size === 1) {
      return false;
    }

    if (/(.)\1{4,}/i.test(valor.replace(/\s/g, ""))) {
      return false;
    }

    return true;
  };

  const manejarNormalizacion = (e) => {
    const { name, value } = e.target;

    if (!value.trim()) return;

    setFormulario((previo) => ({
      ...previo,
      [name]: normalizarTexto(value),
    }));
  };

  const manejarNormalizacionFormacion = (e, tipo, campo) => {
    const valor = e.target.value;

    if (!valor.trim()) return;

    setFormulario((previo) => ({
      ...previo,
      formacion: {
        ...previo.formacion,
        [tipo]: {
          ...previo.formacion[tipo],
          [campo]: normalizarTexto(valor),
        },
      },
    }));
  };
  const guardarCambios = (e) => {
    e.preventDefault();

    const tiposFormacion = [
      { id: "universitario", nombre: "título universitario" },
      { id: "terciario", nombre: "título terciario" },
      { id: "cursos", nombre: "curso realizado" },
    ];

    for (const tipo of tiposFormacion) {
      const formacion = formulario.formacion[tipo.id];

      if (formacion.seleccionado && !validarFormacion(formacion.titulo)) {
        setMensaje(
          `El nombre del ${tipo.nombre} no es válido. Ingresá al menos 4 caracteres y un nombre descriptivo.`,
        );
        return;
      }
    }

    const nuevosDatos = {
  ...perfilInicial,
  ...formulario,
};

setPerfil(nuevosDatos);
actualizarPerfil(nuevosDatos);
setEditando(false);
setMensaje("¡Tu perfil docente se actualizó correctamente!");

setTimeout(() => setMensaje(""), 3000);
  };

  const cancelarEdicion = () => {
    setFormulario({ ...perfil });
    setEditando(false);
    setMensaje("");
  };

  const iniciales =
    `${perfil.nombre.charAt(0)}${perfil.apellido.charAt(0)}`.toUpperCase();

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
                setFormulario({ ...perfil });
                setEditando(true);
                setMensaje("");
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
            <div className="perfil-avatar">{iniciales || "P"}</div>

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
                  onBlur={manejarNormalizacion}
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
                  onBlur={manejarNormalizacion}
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
                <label>Materias que enseñás</label>

                {editando ? (
                  <div className="registro-materias">
                    {materiasDisponibles.map((materia) => (
                      <label key={materia.id_materia}>
                        <input
                          type="checkbox"
                          checked={formulario.materias.includes(
                            Number(materia.id_materia),
                          )}
                          onChange={(e) => {
                            const id = Number(materia.id_materia);

                            setFormulario((previo) => ({
                              ...previo,
                              materias: e.target.checked
                                ? [...previo.materias, id]
                                : previo.materias.filter((m) => m !== id),
                            }));
                          }}
                        />
                        {materia.nombre}
                      </label>
                    ))}
                  </div>
                ) : (
                  <p>
                    {perfil.materias
                      .map(
                        (id) =>
                          materiasDisponibles.find(
                            (materia) =>
                              Number(materia.id_materia) === Number(id),
                          )?.nombre,
                      )
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>

              <div className="registro-campo perfil-campo-completo">
                <label htmlFor="profesor-modalidad">
                  Modalidad de enseñanza
                </label>

                {editando ? (
                  <select
                    id="profesor-modalidad"
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
                ) : (
                  <p>{perfil.modalidad || "Sin modalidad especificada"}</p>
                )}
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
                  onBlur={manejarNormalizacion}
                  disabled={!editando}
                  rows={4}
                  placeholder="Contanos sobre tu forma de enseñar."
                  required
                />
              </div>

              <div className="registro-campo perfil-campo-completo">
                <h3>Formación académica</h3>

                {["universitario", "terciario", "cursos"].map((tipo) => {
                  const nombres = {
                    universitario: "Título universitario",
                    terciario: "Título terciario",
                    cursos: "Cursos realizados",
                  };

                  const formacion = editando
                    ? formulario.formacion
                    : perfil.formacion;

                  const datos = formacion[tipo];

                  if (!editando && !datos.seleccionado) {
                    return null;
                  }

                  return (
                    <div key={tipo} className="perfil-formacion-item">
                      {editando ? (
                        <>
                          <label className="registro-checkbox">
                            <input
                              type="checkbox"
                              checked={datos.seleccionado}
                              onChange={(e) => {
                                setFormulario((previo) => ({
                                  ...previo,
                                  formacion: {
                                    ...previo.formacion,
                                    [tipo]: {
                                      ...previo.formacion[tipo],
                                      seleccionado: e.target.checked,
                                    },
                                  },
                                }));
                              }}
                            />
                            {nombres[tipo]}
                          </label>

                          {datos.seleccionado && (
                            <div className="registro-subcampo">
                              <input
                                type="text"
                                placeholder="Nombre del título, carrera o curso"
                                value={datos.titulo}
                                required
                                onChange={(e) => {
                                  setFormulario((previo) => ({
                                    ...previo,
                                    formacion: {
                                      ...previo.formacion,
                                      [tipo]: {
                                        ...previo.formacion[tipo],
                                        titulo: e.target.value,
                                      },
                                    },
                                  }));
                                }}
                                onBlur={(e) =>
                                  manejarNormalizacionFormacion(
                                    e,
                                    tipo,
                                    "titulo",
                                  )
                                }
                              />

                              <input
                                type="text"
                                placeholder="Universidad o institución"
                                value={datos.institucion}
                                required
                                onChange={(e) =>
                                  setFormulario((previo) => ({
                                    ...previo,
                                    formacion: {
                                      ...previo.formacion,
                                      [tipo]: {
                                        ...previo.formacion[tipo],
                                        institucion: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                onBlur={(e) =>
                                  manejarNormalizacionFormacion(
                                    e,
                                    tipo,
                                    "institucion",
                                  )
                                }
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        datos.seleccionado && (
                          <div>
                            <strong>{nombres[tipo]}</strong>
                            <p>{datos.titulo}</p>
                            <p>{datos.institucion}</p>
                          </div>
                        )
                      )}
                    </div>
                  );
                })}

                {!editando &&
                  !Object.values(perfil.formacion).some(
                    (item) => item.seleccionado,
                  ) && <p>Sin formación académica especificada.</p>}
              </div>

              <div className="registro-campo perfil-campo-completo">
                <h3>Experiencia laboral</h3>

                {editando ? (
                  <>
                    <p>¿Tenés experiencia dando clases?</p>

                    <div className="registro-opciones-experiencia">
                      <label className="registro-checkbox">
                        <input
                          type="checkbox"
                          checked={formulario.tieneExperiencia === true}
                          onChange={() => {
                            setFormulario((previo) => ({
                              ...previo,
                              tieneExperiencia:
                                previo.tieneExperiencia === true ? null : true,
                            }));
                          }}
                        />
                        Sí, tengo experiencia
                      </label>

                      <label className="registro-checkbox">
                        <input
                          type="checkbox"
                          checked={formulario.tieneExperiencia === false}
                          onChange={() => {
                            setFormulario((previo) => ({
                              ...previo,
                              tieneExperiencia:
                                previo.tieneExperiencia === false
                                  ? null
                                  : false,
                              detalleExperiencia: "",
                            }));
                          }}
                        />
                        No tengo experiencia
                      </label>
                    </div>

                    {formulario.tieneExperiencia === true && (
                      <textarea
                        name="detalleExperiencia"
                        value={formulario.detalleExperiencia}
                        onChange={manejarCambio}
                        onBlur={manejarNormalizacion}
                        placeholder="Contanos dónde trabajaste, qué materias enseñaste y cuánto tiempo de experiencia tenés."
                        rows={4}
                        required
                      />
                    )}
                  </>
                ) : (
                  <>
                    <p>
                      {perfil.tieneExperiencia === true
                        ? "Sí, tengo experiencia"
                        : perfil.tieneExperiencia === false
                          ? "No tengo experiencia"
                          : "Sin información especificada"}
                    </p>

                    {perfil.tieneExperiencia === true && (
                      <p>{perfil.detalleExperiencia}</p>
                    )}
                  </>
                )}
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
  );
}

export default PerfilProfesor;
