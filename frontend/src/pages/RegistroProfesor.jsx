import { useState, useEffect } from 'react'
import { obtenerMaterias } from '../services/materias'
import { obtenerInstituciones } from '../services/instituciones'

function RegistroProfesor({ onNavegar }) {
    const [formulario, setFormulario] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmarPassword: '',
        materias: [],
        modalidad: '',
        presentacion: '',
        formacion: {
            universitario: {
                seleccionado: false,
                titulo: '',
                institucion: ''
            },
            terciario: {
                seleccionado: false,
                titulo: '',
                institucion: ''
            },
            cursos: {
                seleccionado: false,
                titulo: '',
                institucion: ''
            }
        },
        tieneExperiencia: null,
        detalleExperiencia: ''
    })

    const [institucionesSugeridas, setInstitucionesSugeridas] = useState([])
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

        setFormulario(previo => ({
            ...previo,
            [name]: value
        }))
    }

    const normalizarTexto = (texto) => {
        return texto
            .toLowerCase()
            .replace(/(^\s*[a-záéíóúüñ]|[.!?]\s+[a-záéíóúüñ])/g, letra =>
                letra.toUpperCase()
            )
            .trim()
    }

    const manejarNormalizacion = (e) => {
        const { name, value } = e.target

        if (!value.trim()) return

        setFormulario(previo => ({
            ...previo,
            [name]: normalizarTexto(value)
        }))
    }

    const manejarNormalizacionFormacion = (e, tipo, campo) => {
        const valor = e.target.value

        if (!valor.trim()) return

        setFormulario(previo => ({
            ...previo,
            formacion: {
                ...previo.formacion,
                [tipo]: {
                    ...previo.formacion[tipo],
                    [campo]: normalizarTexto(valor)
                }
            }
        }))
    }

    const manejarCambioInstitucion = (e, tipo) => {
        const valor = e.target.value

        setFormulario(previo => ({
            ...previo,
            formacion: {
                ...previo.formacion,
                [tipo]: {
                    ...previo.formacion[tipo],
                    institucion: valor
                }
            }
        }))

        setInstitucionesSugeridas(obtenerInstituciones(valor))
    }

    const manejarSeleccionInstitucion = (institucion, tipo) => {
        setFormulario(previo => ({
            ...previo,
            formacion: {
                ...previo.formacion,
                [tipo]: {
                    ...previo.formacion[tipo],
                    institucion: institucion.nombre
                }
            }
        }))

        setInstitucionesSugeridas([])
    }

    const manejarEnvio = (e) => {
        e.preventDefault()
        setError('')
        setMensaje('')

        const presentacion = formulario.presentacion.trim()

        if (presentacion.length < 30) {
            setError('La presentación profesional debe tener al menos 30 caracteres.')
            return
        }

        if (presentacion.length > 500) {
            setError('La presentación profesional no puede superar los 500 caracteres.')
            return
        }

        if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(presentacion)) {
            setError('La presentación debe contener texto válido.')
            return
        }

        if (/(.)\1{5,}/i.test(presentacion.replace(/\s/g, ''))) {
            setError('La presentación contiene demasiados caracteres repetidos.')
            return
        }

        localStorage.setItem('usuarioRol', 'profesor')

        onNavegar('Mi perfil', {
            nombre: formulario.nombre,
            apellido: formulario.apellido,
            email: formulario.email,
            materias: formulario.materias,
            modalidad: formulario.modalidad,
            presentacion: formulario.presentacion,
            formacion: formulario.formacion,
            tieneExperiencia: formulario.tieneExperiencia,
            detalleExperiencia: formulario.detalleExperiencia,
            rol: 'profesor'
        })
    }

    return (
        <div className="registro-pagina">
            <div className="registro-tarjeta registro-tarjeta-profesor">

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
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            id="nombre"
                            name="nombre"
                            value={formulario.nombre}
                            onChange={manejarCambio}
                            onBlur={manejarNormalizacion}
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
                            onBlur={manejarNormalizacion}
                            placeholder="Tu apellido"
                            autoComplete="family-name"
                            required
                        />
                    </div>

                    <div className="registro-campo registro-campo-completo">
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
                        <label>Materias que enseñás</label>

                        <div className="registro-materias">
                            {materiasDisponibles.map((materia) => (
                                <label key={materia.id_materia}>
                                    <input
                                        type="checkbox"
                                        checked={formulario.materias.includes(materia.id_materia)}
                                        onChange={(e) => {
                                            const id = materia.id_materia

                                            setFormulario(previo => ({
                                                ...previo,
                                                materias: e.target.checked
                                                    ? [...previo.materias, id]
                                                    : previo.materias.filter(m => m !== id)
                                            }))
                                        }}
                                    />
                                    {materia.nombre}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="registro-campo registro-campo-completo">
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

                    <div className="registro-campo registro-campo-completo">
                        <label htmlFor="presentacion">
                            Presentación profesional
                        </label>

                        <textarea
                            id="presentacion"
                            name="presentacion"
                            value={formulario.presentacion}
                            onChange={manejarCambio}
                            onBlur={manejarNormalizacion}
                            placeholder="Contanos sobre tu experiencia y cómo enseñás"
                            rows={4}
                            required
                        />
                    </div>

                    <div className="registro-campo registro-campo-completo">
                        <h3>Formación académica</h3>
                        <p>¿Tenés algún título o formación?</p>

                        {[
                            { id: 'universitario', nombre: 'Título universitario' },
                            { id: 'terciario', nombre: 'Título terciario' },
                            { id: 'cursos', nombre: 'Cursos realizados' }
                        ].map((tipo) => (
                            <div
                                className="registro-opcion-formacion"
                                key={tipo.id}
                            >
                                <label className="registro-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={formulario.formacion[tipo.id].seleccionado}
                                        onChange={(e) => {
                                            setFormulario(previo => ({
                                                ...previo,
                                                formacion: {
                                                    ...previo.formacion,
                                                    [tipo.id]: {
                                                        ...previo.formacion[tipo.id],
                                                        seleccionado: e.target.checked
                                                    }
                                                }
                                            }))
                                        }}
                                    />
                                    {tipo.nombre}
                                </label>

                                {formulario.formacion[tipo.id].seleccionado && (
                                    <div className="registro-subcampo">

                                        <input
                                            type="text"
                                            placeholder="Nombre del título, carrera o curso"
                                            onBlur={(e) => manejarNormalizacionFormacion(e, tipo.id, 'titulo')}
                                            value={formulario.formacion[tipo.id].titulo}
                                            onChange={(e) => {
                                                setFormulario(previo => ({
                                                    ...previo,
                                                    formacion: {
                                                        ...previo.formacion,
                                                        [tipo.id]: {
                                                            ...previo.formacion[tipo.id],
                                                            titulo: e.target.value
                                                        }
                                                    }
                                                }))
                                            }}
                                            required
                                        />

                                        <div className="institucion-autocomplete">
                                            <input
                                                type="text"
                                                placeholder="Universidad o institución"
                                                onBlur={(e) => manejarNormalizacionFormacion(e, tipo.id, 'institucion')}
                                                value={formulario.formacion[tipo.id].institucion}
                                                onChange={(e) => manejarCambioInstitucion(e, tipo.id)}
                                                required
                                            />

                                            {institucionesSugeridas.length > 0 && (
                                                <div className="institucion-sugerencias">
                                                    {institucionesSugeridas.map((institucion, indice) => (
                                                        <button
                                                            key={indice}
                                                            type="button"
                                                            onMouseDown={(e) => {
                                                                e.preventDefault()
                                                                manejarSeleccionInstitucion(institucion, tipo.id)
                                                            }}
                                                        >
                                                            {institucion.nombre}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="registro-campo registro-campo-completo">
                        <h3>Experiencia laboral</h3>
                        <p>¿Tenés experiencia dando clases?</p>

                        <div className="registro-opciones-experiencia">
                            <label className="registro-checkbox">
                                <input
                                    type="checkbox"
                                    checked={formulario.tieneExperiencia === true}
                                    onChange={() => {
                                        setFormulario(previo => ({
                                            ...previo,
                                            tieneExperiencia: previo.tieneExperiencia === true ? null : true
                                        }))
                                    }}
                                />
                                Sí, tengo experiencia
                            </label>

                            <label className="registro-checkbox">
                                <input
                                    type="checkbox"
                                    checked={formulario.tieneExperiencia === false}
                                    onChange={() => {
                                        setFormulario(previo => ({
                                            ...previo,
                                            tieneExperiencia: previo.tieneExperiencia === false ? null : false,
                                            detalleExperiencia: ''
                                        }))
                                    }}
                                />
                                No tengo experiencia
                            </label>
                        </div>

                        {formulario.tieneExperiencia && (
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
