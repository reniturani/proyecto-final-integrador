
const API_URL = 'http://localhost:3000/api/estudiantes'

// Obtener estudiantes con búsqueda, paginación y ordenamiento
export async function obtenerEstudiantes({
    pagina = 1,
    limite = 10,
    buscar = '',
    orden = 'id_estudiante',
    direccion = 'ASC'
} = {}) {
    const parametros = new URLSearchParams({
        pagina: String(pagina),
        limite: String(limite),
        buscar,
        orden,
        direccion
    })

    const respuesta = await fetch(`${API_URL}?${parametros.toString()}`)
    const datos = await respuesta.json()

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudieron cargar los estudiantes')
    }

    return datos
}

// Obtener un estudiante por su ID
export async function obtenerEstudiantePorId(id) {
    const respuesta = await fetch(`${API_URL}/${id}`)
    const datos = await respuesta.json()

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo cargar el estudiante')
    }

    return datos
}

// Crear un estudiante
export async function crearEstudiante(estudiante) {
    const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(estudiante)
    })

    const datos = await respuesta.json()

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo crear el estudiante')
    }

    return datos
}

// Actualizar un estudiante
export async function actualizarEstudiante(id, estudiante, token) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(estudiante)
    })

    const datos = await respuesta.json()

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo actualizar el estudiante')
    }

    return datos
}

// Eliminar un estudiante
export async function eliminarEstudiante(id, token) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const datos = await respuesta.json()

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo eliminar el estudiante')
    }

    return datos
}
