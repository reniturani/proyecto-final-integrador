
const materiasIniciales = [
    
    {
        id_materia: 1,
        nombre: 'Bases de Datos',
        descripcion: 'Diseño y gestión de bases de datos relacionales y no relacionales, modelado entidad-relación, normalización, consultas SQL y optimización de almacenamiento.'
    },
    {
        id_materia: 2,
        nombre: 'Contabilidad',
        descripcion: 'Introducción a los principios contables, registración de operaciones comerciales, análisis de cuentas y elaboración de estados financieros básicos.'
    },
    {
        id_materia: 3,
        nombre: 'Física',
        descripcion: 'Comprensión de conceptos fundamentales de mecánica clásica, cinemática, dinámica, fuerzas, trabajo, energía y fenómenos físicos básicos.'
    },
    {
        id_materia: 4,
        nombre: 'Estadística',
        descripcion: 'Análisis descriptivo e inferencial de datos, medidas de tendencia central y dispersión, cálculo de probabilidades y distribuciones estadísticas.'
    },
    {
        id_materia: 5,
        nombre: 'Historia',
        descripcion: 'Estudio de procesos históricos, acontecimientos relevantes, transformaciones sociales, políticas y económicas a lo largo del tiempo.'
    },
    {
        id_materia: 6,
        nombre: 'Economía',
        descripcion: 'Estudio de conceptos económicos fundamentales, funcionamiento de mercados, oferta y demanda, estructura productiva y asignación de recursos.'
    },
    {
        id_materia: 7,
        nombre: 'Geografía',
        descripcion: 'Análisis del espacio geográfico, distribución de la población, aprovechamiento de recursos naturales, climas y organización territorial.'
    },
    {
        id_materia: 8,
        nombre: 'Lengua y Literatura',
        descripcion: 'Comprensión y análisis crítico de textos, reglas de gramática y ortografía, producción escrita y estudio de obras literarias.'
    },
    {
        id_materia: 9,
        nombre: 'Sistemas Operativos',
        descripcion: 'Estudio de la arquitectura de sistemas operativos, gestión de procesos, administración de memoria, sistemas de archivos y concurrencia.'
    },
    {
        id_materia: 10,
        nombre: 'Redes de Computadoras',
        descripcion: 'Fundamentos de comunicación de datos, protocolos de red, modelos de referencia (OSI y TCP/IP), direccionamiento y seguridad básica.'
    },
    {
        id_materia: 11,
        nombre: 'Macroeconomía',
        descripcion: 'Estudio de variables económicas agregadas como inflación, desempleo, crecimiento económico, producto bruto interno y políticas fiscales y monetarias.'
    },
    {
        id_materia: 12,
        nombre: 'Costos',
        descripcion: 'Análisis y clasificación de costos fijos y variables, sistemas de costeo, determinación del punto de equilibrio y toma de decisiones financieras.'
    },
    {
        id_materia: 13,
        nombre: 'Matemática Financiera',
        descripcion: 'Análisis del valor del dinero en el tiempo, cálculo de interés simple y compuesto, tasas de interés, descuentos, rentas y amortización de préstamos.'
    }
]

// Datos temporales: no se realizan solicitudes al backend ni a SQLite.
let materias = materiasIniciales.map(materia => ({ ...materia }))

let siguienteId = Math.max(...materias.map(m => m.id_materia)) + 1

const ordenarMaterias = (lista, orden, direccion) => {
    const multiplicador = direccion === 'DESC' ? -1 : 1

    return [...lista].sort((a, b) => {
        const valorA = a[orden] ?? ''
        const valorB = b[orden] ?? ''

        if (typeof valorA === 'number' && typeof valorB === 'number') {
            return (valorA - valorB) * multiplicador
        }

        return String(valorA).localeCompare(String(valorB), 'es', {
            sensitivity: 'base'
        }) * multiplicador
    })
}

export async function obtenerMaterias({
    pagina = 1,
    limite = 10,
    buscar = '',
    orden = 'id_materia',
    direccion = 'ASC'
} = {}) {
    const termino = buscar.trim().toLowerCase()

    const filtradas = materias.filter(materia =>
        `${materia.nombre} ${materia.descripcion || ''}`
            .toLowerCase()
            .includes(termino)
    )

    const ordenadas = ordenarMaterias(filtradas, orden, direccion)
    const totalRegistros = ordenadas.length
    const totalPaginas = Math.ceil(totalRegistros / limite)
    const inicio = (pagina - 1) * limite

    return {
        datos: ordenadas.slice(inicio, inicio + limite),
        totalRegistros,
        pagina,
        limite,
        totalPaginas
    }
}

export async function obtenerMateriaPorId(id) {
    const materia = materias.find(
        m => m.id_materia === Number(id)
    )

    if (!materia) {
        throw new Error('No se encontró la materia')
    }

    return { ...materia }
}

export async function crearMateria(materia) {
    const nuevoNombre = materia.nombre.trim()

    if (materias.some(m => m.nombre.toLowerCase() === nuevoNombre.toLowerCase())) {
        throw new Error('Ya existe una materia con ese nombre')
    }

    const nuevaMateria = {
        ...materia,
        nombre: nuevoNombre,
        id_materia: siguienteId++
    }

    materias.push(nuevaMateria)

    return {
        mensaje: 'Materia creada correctamente en la simulación',
        materia: { ...nuevaMateria }
    }
}

export async function actualizarMateria(id, materia) {
    const indice = materias.findIndex(
        m => m.id_materia === Number(id)
    )

    if (indice === -1) {
        throw new Error('No se encontró la materia')
    }

    const nuevoNombre = materia.nombre.trim()

    const nombreDuplicado = materias.some(
        (m, i) => i !== indice &&
            m.nombre.toLowerCase() === nuevoNombre.toLowerCase()
    )

    if (nombreDuplicado) {
        throw new Error('Ya existe una materia con ese nombre')
    }

    const actualizada = {
        ...materias[indice],
        ...materia,
        nombre: nuevoNombre,
        id_materia: Number(id)
    }

    materias[indice] = actualizada

    return {
        mensaje: 'Materia actualizada correctamente en la simulación',
        materia: { ...actualizada }
    }
}

export async function eliminarMateria(id) {
    const existe = materias.some(
        m => m.id_materia === Number(id)
    )

    if (!existe) {
        throw new Error('No se encontró la materia')
    }

    materias = materias.filter(
        m => m.id_materia !== Number(id)
    )

    return {
        mensaje: 'Materia eliminada correctamente de la simulación'
    }
}
