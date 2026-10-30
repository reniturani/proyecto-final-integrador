const API_URL = 'http://localhost:3000/api/materias'

// Obtener materias con búsqueda, paginación y ordenamiento
export async function obtenerMaterias({
    pagina = 1,
    limite = 10,
    buscar = '',
    orden = 'id_materia',
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
        throw new Error(
            datos.mensaje || 'No se pudieron cargar las materias'
        )
    }

    return datos
}

// Obtener una materia por su ID
export async function obtenerMateriaPorId(id) {
    const respuesta = await fetch(`${API_URL}/${id}`)
    const datos = await respuesta.json()

    if (!respuesta.ok) {
        throw new Error(
            datos.mensaje || 'No se pudo cargar la materia'
        )
    }

    return datos
}

// Actualizar una materia por su ID (requiere token de administrador)
export async function actualizarMateria(id, materia, token) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(materia)
    })

    const datos = await respuesta.json()

    if (!respuesta.ok) {
        throw new Error(
            datos.mensaje || 'No se pudo actualizar la materia'
        )
    }

    return datos
}

// Eliminar una materia por su ID (requiere token de administrador)
export async function eliminarMateria(id, token) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const datos = await respuesta.json()

    if (!respuesta.ok) {
        throw new Error(
            datos.mensaje || 'No se pudo eliminar la materia'
        )
    }

    return datos
}

// Crear una materia (requiere token de administrador)
export async function crearMateria(materia, token) {
    const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(materia)
    })

    const datos = await respuesta.json()

    if (!respuesta.ok) {
        throw new Error(
            datos.mensaje || 'No se pudo crear la materia'
        )
    }

    return datos
}
