import { useState, useEffect } from 'react'
import { obtenerMaterias } from '../services/materias'
import { obtenerInstituciones } from '../services/instituciones'
import {
    obtenerCarrerasPorInstitucion,
    obtenerInstitucionesPorCarrera
} from '../services/carrerasPorInstitucion'


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
                institucion: '',
                carrera: ''
            },
            terciario: {
                seleccionado: false,
                titulo: '',
                institucion: '',
                carrera: ''
            },
            cursos: {
                seleccionado: false,
                titulo: '',
                institucion: '',
                carrera: ''
            }
        },
        tieneExperiencia: null,
        detalleExperiencia: ''
    })

    const [institucionesSugeridas, setInstitucionesSugeridas] = useState([])
    const [tipoInstitucionActiva, setTipoInstitucionActiva] = useState(null)
    const [carrerasSugeridas, setCarrerasSugeridas] = useState([])
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
    const formatearNombre = (texto) => {
    return texto
        .trim()
        .toLowerCase()
        .replace(/\b\p{L}/gu, (letra) => letra.toUpperCase());
};

const validarFormacion = (texto) => {
    const valor = texto.trim();

    // Debe tener al menos 4 caracteres.
    if (valor.length < 4) return false;

    // Debe contener letras.
    if (!/[a-záéíóúüñ]/i.test(valor)) return false;

    // No debe ser solamente números o símbolos.
    if (!/[a-záéíóúüñ]{2,}/i.test(valor)) return false;

    // No permite repetir una misma letra demasiadas veces.
    if (/(.)\1{4,}/i.test(valor.replace(/\s/g, ''))) return false;

    return true;
};


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

    const valorNormalizado = campo === 'institucion' || campo === 'titulo'
        ? formatearNombre(valor)
        : normalizarTexto(valor)

    setFormulario(previo => ({
        ...previo,
        formacion: {
            ...previo.formacion,
            [tipo]: {
                ...previo.formacion[tipo],
                [campo]: valorNormalizado
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
        setTipoInstitucionActiva(tipo)
        setInstitucionesSugeridas(obtenerInstituciones(valor))
    }

    const manejarCambioCarrera = (e, tipo) => {
    const valor = e.target.value

    setFormulario(previo => ({
        ...previo,
        formacion: {
            ...previo.formacion,
            [tipo]: {
                ...previo.formacion[tipo],
                carrera: valor,
                titulo: valor,
                institucion: ''
            }
        }
    }))
    setInstitucionesSugeridas([])
    setCarrerasSugeridas(obtenerInstitucionesPorCarrera(valor))
    setTipoInstitucionActiva(tipo)
}



    const manejarSeleccionInstitucion = (institucion, tipo) => {

    const carreras = obtenerOpcionesCarrera(institucion.nombre)

    setFormulario(previo => {

        const carreraActual = previo.formacion[tipo].carrera

        const normalizar = texto =>
            texto.toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .trim()

        const carreraBuscada = normalizar(carreraActual)

const carreraEncontrada = carreraBuscada
    ? carreras.find(
        carrera => normalizar(carrera) === carreraBuscada
    ) || carreras.find(
        carrera => normalizar(carrera).includes(carreraBuscada)
    )
    : null

        return {
            ...previo,
            formacion: {
                ...previo.formacion,
                [tipo]: {
                    ...previo.formacion[tipo],
                    institucion: institucion.nombre,
                    carrera: carreraEncontrada || carreraActual,
                    titulo: carreraEncontrada || previo.formacion[tipo].titulo
                }
            }
        }
    })

    setInstitucionesSugeridas([])
    setCarrerasSugeridas([])
    setTipoInstitucionActiva(null)
}

    const obtenerOpcionesCarrera = (nombreInstitucion) => {
    const oferta = obtenerCarrerasPorInstitucion(nombreInstitucion)

    if (!oferta) return []

    return [
        ...(oferta.grado || []),
        ...(oferta.pregrado || []),
        ...(oferta.profesorados || []),
        ...(oferta.ciclos || []),
        ...(oferta.posgrado || []),
        ...(oferta.diplomaturas || [])
    ]
}   

    const manejarEnvio = (e) => {
        e.preventDefault()
        setError('')
        setMensaje('')
        if (formulario.materias.length === 0) {
            setError('Tenes que seleccionar al menos una materia para registrarte como profesor.')
            return
        }

        const presentacion = formulario.presentacion.trim()

        const textoPresentacion = presentacion.toLowerCase()

        const expresionesEstudiante = [ //validacion para que no se pueda registrar un estudiante como profesor
            'estoy estudiando',
            'estudio',
            'estudiar',
            'soy estudiante',
            'busco aprender',
            'quiero aprender',
            'quiero estudiar',
            'busco reforzar',
            'preparar mis examenes',
            'preparar mis exámenes'
        ]
        if (expresionesEstudiante.some(expresion => textoPresentacion.includes(expresion))) {
            setError('La presentación debe describir tu perfil como profesor, tu experiencia o tu metodología de enseñanza.')
            return
        }

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
        // Evitar presentaciones con texto sin sentido
const palabrasPresentacion =
    presentacion.match(/[a-záéíóúüñ]+/gi) || []

const conectoresCortos = ['a', 'y', 'o', 'e', 'u']
const abreviaturasPermitidas = ['sql', 'html', 'css', 'pc', 'etc']

const palabrasInvalidas = palabrasPresentacion.filter(palabra => {
    const palabraNormalizada = palabra.toLowerCase()

    if (conectoresCortos.includes(palabraNormalizada)) {
        return false
    }

    const sinVocal = !/[aeiouáéíóúü]/i.test(palabra)

    const consonantesExcesivas =
        /[bcdfghjklmnñpqrstvwxyz]{5,}/i.test(palabra)

    return (
        palabra.length === 1 ||
        (sinVocal && !abreviaturasPermitidas.includes(palabraNormalizada)) ||
        consonantesExcesivas
    )
})

if (palabrasPresentacion.length < 5 || palabrasInvalidas.length > 0) {
    setError('La presentación profesional debe contener al menos 5 palabras y estar redactada con texto comprensible.')
    return
}
        const tiposFormacion = [
            { id: 'universitario', nombre: 'título universitario' },
            { id: 'terciario', nombre: 'título terciario' },
            { id: 'cursos', nombre: 'curso realizado' }
        ]
        for (const tipo of tiposFormacion) {
            const formacion = formulario.formacion[tipo.id]

            if (formacion.seleccionado && !validarFormacion(formacion.titulo)) {
                setError(
                    `El nombre del ${tipo.nombre} no es válido. Ingresá al menos 4 caracteres y un nombre descriptivo.`
                )
                return
            }
        }

        if (formulario.tieneExperiencia === true) {
        const detalle = formulario.detalleExperiencia.trim()
        const palabras = detalle.split(/\s+/).filter(palabra => palabra.length > 1)

        if (detalle.length < 15) {
        setError('Contanos tu experiencia laboral con al menos 15 caracteres.')
        return
        }

        if (palabras.length < 3) {
        setError('Describí tu experiencia utilizando al menos 3 palabras.')
        return
        }

        if (!/[a-záéíóúüñ]{2,}/i.test(detalle)) {
        setError('La experiencia laboral debe contener texto válido.')
        return
        }

        if (/(.)\1{4,}/i.test(detalle.replace(/\s/g, ''))) {
        setError('La descripción contiene demasiados caracteres repetidos.')
        return
        }

        if (/asdf|qwerty|123456|abcdef|prueba|^a+$/i.test(detalle.replace(/\s/g, ''))) {
        setError('Ingresá una descripción válida de tu experiencia laboral.')
        return
        }
}
        localStorage.setItem('usuarioRol', 'profesor')

        onNavegar('Mi perfil', {
            nombre: formatearNombre(formulario.nombre),
            apellido: formatearNombre(formulario.apellido),
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

        {obtenerOpcionesCarrera(
            formulario.formacion[tipo.id].institucion
        ).length > 0 ? (
            <select
                value={formulario.formacion[tipo.id].carrera}
                onChange={(e) => {
                    setFormulario(previo => ({
                        ...previo,
                        formacion: {
                            ...previo.formacion,
                            [tipo.id]: {
                                ...previo.formacion[tipo.id],
                                carrera: e.target.value,
                                titulo: e.target.value
                            }
                        }
                    }))
                }}
                required
            >
                <option value="">Seleccioná tu carrera</option>

                {obtenerOpcionesCarrera(
                    formulario.formacion[tipo.id].institucion
                ).map((carrera, indice) => (
                    <option key={indice} value={carrera}>
                        {carrera}
                    </option>
                ))}
            </select>
        ) : (
            <input
    type="text"
    placeholder="Nombre del título, carrera o curso"
    onBlur={(e) =>
        manejarNormalizacionFormacion(e, tipo.id, 'titulo')
    }
    value={formulario.formacion[tipo.id].titulo}
    onChange={(e) => manejarCambioCarrera(e, tipo.id)}
    required
/>)}

        <div className="institucion-autocomplete">
            <input
                type="text"
                placeholder="Universidad o institución"
                onBlur={(e) =>
                    manejarNormalizacionFormacion(e, tipo.id, 'institucion')
                }
                value={formulario.formacion[tipo.id].institucion}
                onChange={(e) => manejarCambioInstitucion(e, tipo.id)}
                required
            />

            {tipoInstitucionActiva === tipo.id &&
                institucionesSugeridas.length > 0 && (
                    <div className="institucion-sugerencias">
                        {institucionesSugeridas.map((institucion, indice) => (
                            <button
                                key={indice}
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault()
                                    manejarSeleccionInstitucion(
                                        institucion,
                                        tipo.id
                                    )
                                    setCarrerasSugeridas([])
                                }}
                            >
                                {institucion.nombre}
                            </button>
                        ))}
                                        </div>
                                        
                                    )}
                                    {tipoInstitucionActiva === tipo.id &&
    carrerasSugeridas.length > 0 && (
        <div className="institucion-sugerencias">
            {carrerasSugeridas.map((institucion, indice) => (
                <button
                    key={indice}
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault()

                        manejarSeleccionInstitucion(
                            institucion,
                            tipo.id
                        )

                        setCarrerasSugeridas([])
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
