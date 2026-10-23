import { useEffect, useState } from 'react'
import '../App.css'
import '../styles/aprender.css'
import { obtenerMaterias } from '../services/materias'
import { buscarProfesores as consultarProfesores } from '../services/profesores'

function Aprender() {
    const [materias, setMaterias] = useState([])
    const [materiaSeleccionada, setMateriaSeleccionada] = useState('')
    const [modalidadSeleccionada, setModalidadSeleccionada] = useState('')
    const [profesores, setProfesores] = useState([])
    const [error, setError] = useState('')
    const [busquedaRealizada, setBusquedaRealizada] = useState(false)
    const [buscando, setBuscando] = useState(false)
    
    
    useEffect(() => {
        async function cargarMaterias() {
            try {
                const datos = await obtenerMaterias({ limite: 100 })
                setMaterias(datos.datos || [])
            } catch (error) {
                console.error('Error al cargar materias:', error)
                setError('No se pudieron cargar las materias.')
            }
        }
        cargarMaterias()
    }, [])
    
    async function buscarProfesores() {
        setBuscando(true)
        setError('')
        setBusquedaRealizada(false)
        setProfesores([])
        
        try {
            const datos = await consultarProfesores({
                materia: materiaSeleccionada,
                modalidad: modalidadSeleccionada
            })
            
            setProfesores(datos.profesores)
            setBusquedaRealizada(true)
        } catch (error) {
            console.error('Error al buscar profesores:', error)
            setError('No se pudo realizar la búsqueda. Intentá nuevamente.')
        } finally {
            setBuscando(false)
        }
    }

    return (
        <main className="page-container">
            <section className="aprender-header">
                <h1 className="page-title">
                    ¿Qué quieres <span className="highlight">aprender?</span>
                </h1>

                <p>Encontrá al profesor ideal para vos.</p>
            </section>

            <section className="aprender-filtros">
                <div className="filtro">
                    <label htmlFor="materia">Materia</label>

                    <select
                        id="materia"
                        value={materiaSeleccionada}
                        onChange={(evento) =>
                            setMateriaSeleccionada(evento.target.value)
                        }
                    >
                        <option value="">Elegí una materia</option>

                        {materias.map((materia) => (
                            <option
                                key={materia.id_materia}
                                value={materia.nombre}
                            >
                                {materia.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filtro">
                    <label htmlFor="modalidad">Modalidad</label>

                    <select
                        id="modalidad"
                        value={modalidadSeleccionada}
                        onChange={(evento) =>
                            setModalidadSeleccionada(evento.target.value)
                        }
                    >
                        <option value="">Elegí una modalidad</option>
                        <option value="virtual">Virtual</option>
                        <option value="presencial">Presencial</option>
                    </select>
                </div>

                <button
                    type="button"
                    className="aprender-boton"
                    onClick={buscarProfesores}
                    disabled={buscando}
                >
                    {buscando ? 'Buscando...' : 'Buscar profesores'}
                </button>
            </section>

            <section className="aprender-resultados">
                <h2>Profesores para vos</h2>

                {error && <p>{error}</p>}

                {!error && !busquedaRealizada && (
                    <p>
                        Elegí una materia y una modalidad para encontrar profesores.
                    </p>
                )}

                {!error && busquedaRealizada && profesores.length === 0 && (
                    <p>No encontramos profesores para tu búsqueda.</p>
                )}

                {profesores.length > 0 && (
                    <div className="profesores-lista">
                        {profesores.map((profesor) => {
                            const materiasProfesor =
                                profesor.Materias || profesor.materias || []

                            return (
                                <article
                                    className="profesor-tarjeta"
                                    key={profesor.id_profesor}
                                >
                                    {profesor.foto_url && (
                                        <img
                                            className="profesor-foto"
                                            src={profesor.foto_url}
                                            alt={`Foto de ${profesor.nombre} ${profesor.apellido}`}
                                        />
                                    )}

                                    <div className="profesor-info">
                                        <h3>
                                            {profesor.nombre} {profesor.apellido}
                                        </h3>

                                        {profesor.descripcion && (
                                            <p>{profesor.descripcion}</p>
                                        )}
                                        
                                        {profesor.email && (
                                            <p>
                                                <strong>Email:</strong>{' '}
                                                <a href={`mailto:${profesor.email}`}>
                                                    {profesor.email}
                                                    </a>
                                                    </p>
                                                )}

                                        {materiasProfesor.length > 0 && (
                                            <p>
                                                <strong>Materias:</strong>{' '}
                                                {materiasProfesor
                                                    .map((materia) => materia.nombre)
                                                    .join(', ')}
                                            </p>
                                        )}

                                        {profesor.modalidad && (
                                            <p>
                                                <strong>Modalidad:</strong>{' '}
                                                {profesor.modalidad}
                                            </p>
                                        )}

                                        {profesor.precio_hora != null && (
                                            <p>
                                                <strong>Precio por hora:</strong>{' '}
                                                ${profesor.precio_hora}
                                            </p>
                                        )}
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}
            </section>
        </main>
    )
}

export default Aprender
