import { obtenerMaterias } from './materias'
const profesoresIniciales = [
    {
        id_profesor: 1,
        nombre: 'María',
        apellido: 'González',
        email: 'maria.gonzalez@profy.com',
        password: '123456',
        foto_url: '',
        descripcion: 'Profesora de Matemática con experiencia en nivel secundario y universitario.',
        precio_hora: 5000,
        modalidad: 'Virtual',
        ubicacion: 'Bahía Blanca',
        materias: [13]
    },
    {
        id_profesor: 2,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@profy.com',
        password: '123456',
        foto_url: '',
        descripcion: 'Profesor de Historia y Geografía.',
        precio_hora: 4500,
        modalidad: 'Presencial',
        ubicacion: 'Bahía Blanca',
        materias: [5, 7]
    },
    {
        id_profesor: 3,
        nombre: 'Lucía',
        apellido: 'Fernández',
        email: 'lucia.fernandez@profy.com',
        password: '123456',
        foto_url: '',
        descripcion: 'Profesora de Contabilidad y Costos.',
        precio_hora: 6000,
        modalidad: 'Mixta',
        ubicacion: 'Buenos Aires',
        materias: [2, 12]
    },
    {
        id_profesor: 4,
        nombre: 'Martín',
        apellido: 'Rodríguez',
        email: 'martin.rodriguez@profy.com',
        password: '123456',
        foto_url: '',
        descripcion: 'Profesor de Física y Matemática.',
        precio_hora: 5500,
        modalidad: 'Virtual',
        ubicacion: 'Córdoba',
        materias: [3, 13]
    },
    {
        id_profesor: 5,
        nombre: 'Carolina',
        apellido: 'López',
        email: 'carolina.lopez@profy.com',
        password: '123456',
        foto_url: '',
        descripcion: 'Profesora de Economía y Macroeconomía.',
        precio_hora: 6500,
        modalidad: 'Presencial',
        ubicacion: 'Bahía Blanca',
        materias: [6, 11]
    },
    {
        id_profesor: 6,
        nombre: 'Diego',
        apellido: 'Martínez',
        email: 'diego.martinez@profy.com',
        password: '123456',
        foto_url: '',
        descripcion: 'Profesor de Bases de Datos y Sistemas Operativos.',
        precio_hora: 7000,
        modalidad: 'Virtual',
        ubicacion: 'La Plata',
        materias: [1, 9]
    },
    {
        id_profesor: 7,
        nombre: 'Florencia',
        apellido: 'Sánchez',
        email: 'florencia.sanchez@profy.com',
        password: '123456',
        foto_url: '',
        descripcion: 'Profesora de Lengua y Literatura.',
        precio_hora: 4800,
        modalidad: 'Mixta',
        ubicacion: 'Bahía Blanca',
        materias: [8]
    },
    {
        id_profesor: 8,
        nombre: 'Nicolás',
        apellido: 'Torres',
        email: 'nicolas.torres@profy.com',
        password: '123456',
        foto_url: '',
        descripcion: 'Profesor de Redes de Computadoras.',
        precio_hora: 7500,
        modalidad: 'Virtual',
        ubicacion: 'Mar del Plata',
        materias: [10]
    },
    {
        id_profesor: 9,
        nombre: 'Valentina',
        apellido: 'Ramírez',
        email: 'valentina.ramirez@profy.com',
        password: '123456',
        foto_url: '',
        descripcion: 'Profesora de Estadística y Matemática.',
        precio_hora: 5800,
        modalidad: 'Presencial',
        ubicacion: 'Bahía Blanca',
        materias: [4, 13]
    },
    {
        id_profesor: 10,
        nombre: 'Gabriel',
        apellido: 'Acosta',
        email: 'gabriel.acosta@profy.com',
        password: '123456',
        foto_url: '',
        descripcion: 'Profesor de Física y Sistemas Operativos.',
        precio_hora: 6200,
        modalidad: 'Mixta',
        ubicacion: 'Buenos Aires',
        materias: [3, 9]
    },
    {
        id_profesor: 11,
        nombre: 'Camila',
        apellido: 'Díaz',
        email: 'camila.diaz@profy.com',
        password: '123456',
        foto_url: '',
        descripcion: 'Profesora de Contabilidad y Matemática Financiera.',
        precio_hora: 5300,
        modalidad: 'Virtual',
        ubicacion: 'Bahía Blanca',
        materias: [2, 13]
    },
    {
        id_profesor: 12,
        nombre: 'Santiago',
        apellido: 'Benítez',
        email: 'santiago.benitez@profy.com',
        password: '123456',
        foto_url: '',
        descripcion: 'Profesor de Bases de Datos, Redes y Estadística.',
        precio_hora: 8000,
        modalidad: 'Presencial',
        ubicacion: 'Córdoba',
        materias: [1, 10, 4]
    }
]

let profesores = profesoresIniciales.map(profesor => ({
    ...profesor,
    materias: [...profesor.materias]
}))

let siguienteId = Math.max(...profesores.map(p => p.id_profesor)) + 1

function ordenarProfesores(lista, orden, direccion) {
    return [...lista].sort((a, b) => {
        let valorA = a[orden]
        let valorB = b[orden]

        if (typeof valorA === 'string') {
            valorA = valorA.toLowerCase()
            valorB = valorB.toLowerCase()
        }

        if (valorA < valorB) return direccion === 'ASC' ? -1 : 1
        if (valorA > valorB) return direccion === 'ASC' ? 1 : -1
        return 0
    })
}

export async function obtenerProfesores({
    pagina = 1,
    limite = 10,
    buscar = '',
    modalidad = '',
    orden = 'id_profesor',
    direccion = 'ASC'
} = {}) {
    let resultado = [...profesores]

    if (buscar.trim()) {
        const termino = buscar.toLowerCase().trim()
        resultado = resultado.filter(profesor =>
            `${profesor.nombre} ${profesor.apellido} ${profesor.email} ${profesor.descripcion}`
                .toLowerCase()
                .includes(termino)
        )
    }

    if (modalidad) {
        resultado = resultado.filter(
            profesor => profesor.modalidad === modalidad
        )
    }

    resultado = ordenarProfesores(resultado, orden, direccion)

    const totalRegistros = resultado.length
    const totalPaginas = Math.ceil(totalRegistros / limite)
    const inicio = (pagina - 1) * limite

    return {
        datos: resultado.slice(inicio, inicio + limite),
        totalRegistros,
        pagina,
        limite,
        totalPaginas
    }
}

export async function obtenerTodosLosProfesores() {
    return profesores.map(profesor => ({ ...profesor, materias: [...profesor.materias] }))
}

export async function crearProfesor(datos) {
    const emailExiste = profesores.some(
        profesor => profesor.email.toLowerCase() === datos.email.toLowerCase()
    )

    if (emailExiste) {
        throw new Error('Ya existe un profesor registrado con ese email.')
    }

    const nuevoProfesor = {
        ...datos,
        id_profesor: siguienteId++,
        precio_hora: Number(datos.precio_hora),
        materias: [...(datos.materias || [])]
    }

    profesores.push(nuevoProfesor)

    return { mensaje: 'Profesor creado correctamente.', profesor: nuevoProfesor }
}

export async function actualizarProfesor(id, datos) {
    const indice = profesores.findIndex(
        profesor => profesor.id_profesor === Number(id)
    )

    if (indice === -1) {
        throw new Error('No se encontró el profesor.')
    }

    const emailExiste = profesores.some(
        profesor =>
            profesor.id_profesor !== Number(id) &&
            profesor.email.toLowerCase() === datos.email.toLowerCase()
    )

    if (emailExiste) {
        throw new Error('Ya existe otro profesor registrado con ese email.')
    }

    const profesorActualizado = {
        ...profesores[indice],
        ...datos,
        id_profesor: Number(id),
        precio_hora: Number(datos.precio_hora),
        password: datos.password || profesores[indice].password,
        materias: [...(datos.materias || [])]
    }

    profesores[indice] = profesorActualizado

    return {
        mensaje: 'Profesor actualizado correctamente.',
        profesor: profesorActualizado
    }
}

export async function eliminarProfesor(id) {
    const existe = profesores.some(
        profesor => profesor.id_profesor === Number(id)
    )

    if (!existe) {
        throw new Error('No se encontró el profesor.')
    }

    profesores = profesores.filter(
        profesor => profesor.id_profesor !== Number(id)
    )

    return { mensaje: 'Profesor eliminado correctamente.' }
}
// Buscar profesores por materia y modalidad
export const buscarProfesores = async ({ materia = '', modalidad = '' } = {}) => {
    let listaProfesores = await obtenerTodosLosProfesores()
    const respuestaMaterias = await obtenerMaterias({ limite: 100 })
    const listaMaterias = respuestaMaterias.datos || []

    if (materia) {
        const materiaEncontrada = listaMaterias.find(
            m => m.nombre.toLowerCase() === String(materia).toLowerCase() || m.id_materia === Number(materia)
        )

        if (!materiaEncontrada) {
            return { profesores: [] }
        }

        listaProfesores = listaProfesores.filter(profesor =>
            profesor.materias.includes(materiaEncontrada.id_materia)
        )
    }

    if (modalidad) {
        listaProfesores = listaProfesores.filter(profesor =>
            profesor.modalidad.toLowerCase() === modalidad.toLowerCase()
        )
    }

    const profesoresConMaterias = listaProfesores.map(profesor => ({
        ...profesor,
        materias: profesor.materias
            .map(idMat => listaMaterias.find(m => m.id_materia === idMat))
            .filter(Boolean)
    }))

    return { profesores: profesoresConMaterias }
}