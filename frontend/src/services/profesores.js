const API_URL = 'http://localhost:3000/api/profesores'

export async function buscarProfesores({
    materia = '',
    modalidad = ''
} = {}) {
    const parametros = new URLSearchParams()

    if (materia) {
        parametros.set('materia', materia)
    }

    if (modalidad) {
        parametros.set('modalidad', modalidad)
    }

    const respuesta = await fetch(
        `${API_URL}?${parametros.toString()}`
    )

    const datos = await respuesta.json()

    if (!respuesta.ok && respuesta.status !== 404) {
        throw new Error(
            datos.mensaje || 'No se pudieron buscar los profesores'
        )
    }

    return {
        profesores: respuesta.status === 404
            ? []
            : datos.profesores || []
    }
}
