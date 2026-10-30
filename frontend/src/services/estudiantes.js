
const estudiantesIniciales = [
    {
        id_estudiante: 1,
        nombre: 'Martina',
        apellido: 'Gómez',
        email: 'martina.gomez@example.com',
        foto_url: ''
    },
    {
        id_estudiante: 2,
        nombre: 'Lucas',
        apellido: 'Fernández',
        email: 'lucas.fernandez@example.com',
        foto_url: ''
    },
    {
        id_estudiante: 3,
        nombre: 'Sofía',
        apellido: 'Rodríguez',
        email: 'sofia.rodriguez@example.com',
        foto_url: ''
    },
    {
        id_estudiante: 4,
        nombre: 'Tomás',
        apellido: 'Martínez',
        email: 'tomas.martinez@example.com',
        foto_url: ''
    },
    {
        id_estudiante: 5,
        nombre: 'Valentina',
        apellido: 'López',
        email: 'valentina.lopez@example.com',
        foto_url: ''
    },
    {
        id_estudiante: 6,
        nombre: 'Mateo',
        apellido: 'Sánchez',
        email: 'mateo.sanchez@example.com',
        foto_url: ''
    },
    {
        id_estudiante: 7,
        nombre: 'Camila',
        apellido: 'Torres',
        email: 'camila.torres@example.com',
        foto_url: ''
    },
    {
        id_estudiante: 8,
        nombre: 'Benjamín',
        apellido: 'Ramírez',
        email: 'benjamin.ramirez@example.com',
        foto_url: ''
    },
    {
        id_estudiante: 9,
        nombre: 'Julieta',
        apellido: 'Acosta',
        email: 'julieta.acosta@example.com',
        foto_url: ''
    },
    {
        id_estudiante: 10,
        nombre: 'Santiago',
        apellido: 'Díaz',
        email: 'santiago.diaz@example.com',
        foto_url: ''
    },
    {
        id_estudiante: 11,
        nombre: 'Agustina',
        apellido: 'Benítez',
        email: 'agustina.benitez@example.com',
        foto_url: ''
    },
    {
        id_estudiante: 12,
        nombre: 'Nicolás',
        apellido: 'Castro',
        email: 'nicolas.castro@example.com',
        foto_url: ''
    }
]

// Datos temporales: no se realizan solicitudes al backend ni a SQLite.
let estudiantes = estudiantesIniciales.map(estudiante => ({ ...estudiante }))
let siguienteId = Math.max(...estudiantes.map(e => e.id_estudiante)) + 1

const ordenarEstudiantes = (lista, orden, direccion) => {
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

export async function obtenerEstudiantes({
    pagina = 1,
    limite = 10,
    buscar = '',
    orden = 'id_estudiante',
    direccion = 'ASC'
} = {}) {
    const termino = buscar.trim().toLowerCase()

    const filtrados = estudiantes.filter(estudiante =>
        `${estudiante.nombre} ${estudiante.apellido} ${estudiante.email}`
            .toLowerCase()
            .includes(termino)
    )

    const ordenados = ordenarEstudiantes(filtrados, orden, direccion)
    const totalRegistros = ordenados.length
    const totalPaginas = Math.ceil(totalRegistros / limite)
    const inicio = (pagina - 1) * limite

    return {
        datos: ordenados.slice(inicio, inicio + limite),
        totalRegistros,
        pagina,
        limite,
        totalPaginas
    }
}

export async function obtenerEstudiantePorId(id) {
    const estudiante = estudiantes.find(
        e => e.id_estudiante === Number(id)
    )

    if (!estudiante) {
        throw new Error('No se encontró el estudiante')
    }

    return { ...estudiante }
}

export async function crearEstudiante(estudiante) {
    const nuevoEstudiante = {
        ...estudiante,
        id_estudiante: siguienteId++
    }

    delete nuevoEstudiante.password

    estudiantes.push(nuevoEstudiante)

    return {
        mensaje: 'Estudiante creado correctamente en la simulación',
        estudiante: { ...nuevoEstudiante }
    }
}

export async function actualizarEstudiante(id, estudiante) {
    const indice = estudiantes.findIndex(
        e => e.id_estudiante === Number(id)
    )

    if (indice === -1) {
        throw new Error('No se encontró el estudiante')
    }

    const actualizado = {
        ...estudiantes[indice],
        ...estudiante,
        id_estudiante: Number(id)
    }

    delete actualizado.password

    estudiantes[indice] = actualizado

    return {
        mensaje: 'Estudiante actualizado correctamente en la simulación',
        estudiante: { ...actualizado }
    }
}

export async function eliminarEstudiante(id) {
    const existe = estudiantes.some(
        e => e.id_estudiante === Number(id)
    )

    if (!existe) {
        throw new Error('No se encontró el estudiante')
    }

    estudiantes = estudiantes.filter(
        e => e.id_estudiante !== Number(id)
    )

    return {
        mensaje: 'Estudiante eliminado correctamente de la simulación'
    }
}
