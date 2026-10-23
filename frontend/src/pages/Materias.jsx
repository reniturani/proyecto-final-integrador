import { useEffect, useState } from 'react'
import {
    obtenerMaterias,
    obtenerMateriaPorId
} from '../services/materias'
import '../styles/materias.css'
import '../App.css'

function Materias() {
    const [materias, setMaterias] = useState([])
    const [buscar, setBuscar] = useState('')
    const [pagina, setPagina] = useState(1)
    const [limite, setLimite] = useState(10)
    const [orden, setOrden] = useState('id_materia')
    const [direccion, setDireccion] = useState('ASC')

    const [totalRegistros, setTotalRegistros] = useState(0)
    const [totalPaginas, setTotalPaginas] = useState(0)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [intento, setIntento] = useState(0)

    const [mostrarDetalle, setMostrarDetalle] = useState(false)
    const [materiaDetalle, setMateriaDetalle] = useState(null)
    const [idMateriaSeleccionada, setIdMateriaSeleccionada] = useState(null)
    const [cargandoDetalle, setCargandoDetalle] = useState(false)
    const [errorDetalle, setErrorDetalle] = useState('')

    useEffect(() => {
        async function cargarMaterias() {
            setCargando(true)
            setError('')

            try {
                const datos = await obtenerMaterias({
                    pagina,
                    limite,
                    buscar,
                    orden,
                    direccion
                })

                setMaterias(datos.datos || [])
                setTotalRegistros(datos.totalRegistros)
                setTotalPaginas(datos.totalPaginas)
            } catch (error) {
                console.error('Error al cargar materias:', error)
                setError('No se pudieron cargar las materias. Intentá nuevamente.')
                setMaterias([])
                setTotalRegistros(0)
                setTotalPaginas(0)
            } finally {
                setCargando(false)
            }
        }

        cargarMaterias()
    }, [pagina, limite, buscar, orden, direccion, intento])

    function cambiarBusqueda(evento) {
        setBuscar(evento.target.value)
        setPagina(1)
    }

    function cambiarLimite(evento) {
        setLimite(Number(evento.target.value))
        setPagina(1)
    }

    function cambiarOrden(evento) {
        setOrden(evento.target.value)
        setPagina(1)
    }

    function cambiarDireccion(evento) {
        setDireccion(evento.target.value)
        setPagina(1)
    }

    async function cargarDetalle(id) {
        setCargandoDetalle(true)
        setErrorDetalle('')
        setMateriaDetalle(null)

        try {
            const datos = await obtenerMateriaPorId(id)
            setMateriaDetalle(datos.materia || datos)
        } catch (error) {
            console.error('Error al cargar el detalle de la materia:', error)
            setErrorDetalle('No se pudo cargar la materia. Intentá nuevamente.')
        } finally {
            setCargandoDetalle(false)
        }
    }

    function verDetalle(id) {
        setIdMateriaSeleccionada(id)
        setMostrarDetalle(true)
        cargarDetalle(id)
    }

    function volverAlListado() {
        setMostrarDetalle(false)
        setMateriaDetalle(null)
        setErrorDetalle('')
    }

    if (mostrarDetalle) {
        return (
            <main className="page-container">
                <button
                    type="button"
                    className="materias-boton secundario materias-volver"
                    onClick={volverAlListado}
                >
                    ← Volver al listado
                </button>

                <section className="materias-header">
                    <h1 className="page-title">
                        Detalle de <span className="highlight">materia</span>
                    </h1>

                    <p>Información completa de la materia seleccionada.</p>
                </section>

                {cargandoDetalle && (
                    <p className="materias-mensaje">
                        Cargando detalle de la materia...
                    </p>
                )}

                {!cargandoDetalle && errorDetalle && (
                    <div className="materias-mensaje materias-error">
                        <p>{errorDetalle}</p>

                        <button
                            type="button"
                            className="materias-boton"
                            onClick={() => cargarDetalle(idMateriaSeleccionada)}
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {!cargandoDetalle && !errorDetalle && materiaDetalle && (
                    <section className="materia-detalle">
                        <div className="materia-detalle-cabecera">
                            <div className="materia-identificador">
                                {materiaDetalle.id_materia}
                            </div>

                            <div>
                                <h2>{materiaDetalle.nombre}</h2>
                                <p>ID de materia: {materiaDetalle.id_materia}</p>
                            </div>
                        </div>

                        <div className="materia-detalle-campo">
                            <h3>Nombre</h3>
                            <p>{materiaDetalle.nombre}</p>
                        </div>

                        <div className="materia-detalle-campo">
                            <h3>Descripción</h3>
                            <p>
                                {materiaDetalle.descripcion ||
                                    'Sin descripción disponible.'}
                            </p>
                        </div>
                    </section>
                )}
            </main>
        )
    }

    return (
        <main className="page-container">
            <section className="materias-header">
                <h1 className="page-title">
                    Listado de <span className="highlight">materias</span>
                </h1>

                <p>
                    Consultá las materias disponibles y encontrá la que buscás.
                </p>
            </section>

            <section className="materias-filtros">
                <div className="materias-busqueda">
                    <label htmlFor="buscar-materia">
                        Buscar materia
                    </label>

                    <input
                        id="buscar-materia"
                        type="search"
                        placeholder="Buscar por nombre o descripción..."
                        value={buscar}
                        onChange={cambiarBusqueda}
                    />
                </div>

                <div className="materias-opciones">
                    <div className="materias-control">
                        <label htmlFor="limite-materias">
                            Registros por página
                        </label>

                        <select
                            id="limite-materias"
                            value={limite}
                            onChange={cambiarLimite}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <div className="materias-control">
                        <label htmlFor="orden-materias">
                            Ordenar por
                        </label>

                        <select
                            id="orden-materias"
                            value={orden}
                            onChange={cambiarOrden}
                        >
                            <option value="id_materia">ID</option>
                            <option value="nombre">Nombre</option>
                            <option value="descripcion">Descripción</option>
                        </select>
                    </div>

                    <div className="materias-control">
                        <label htmlFor="direccion-materias">
                            Dirección
                        </label>

                        <select
                            id="direccion-materias"
                            value={direccion}
                            onChange={cambiarDireccion}
                        >
                            <option value="ASC">Ascendente</option>
                            <option value="DESC">Descendente</option>
                        </select>
                    </div>
                </div>
            </section>

            <section className="materias-resultados">
                <div className="materias-resumen">
                    <h2>Materias disponibles</h2>

                    {!cargando && !error && (
                        <p>
                            {totalRegistros === 1
                                ? '1 materia encontrada'
                                : `${totalRegistros} materias encontradas`}
                        </p>
                    )}
                </div>

                {cargando && (
                    <p className="materias-mensaje">
                        Cargando materias...
                    </p>
                )}

                {!cargando && error && (
                    <div className="materias-mensaje materias-error">
                        <p>{error}</p>

                        <button
                            type="button"
                            className="materias-boton"
                            onClick={() => setIntento((actual) => actual + 1)}
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {!cargando && !error && materias.length === 0 && (
                    <p className="materias-mensaje">
                        {buscar
                            ? 'No encontramos materias que coincidan con tu búsqueda.'
                            : 'Todavía no hay materias registradas.'}
                    </p>
                )}

                {!cargando && !error && materias.length > 0 && (
                    <>
                        <div className="materias-lista">
                            {materias.map((materia) => (
                                <button
                                    type="button"
                                    className="materia-tarjeta materia-tarjeta-boton"
                                    key={materia.id_materia}
                                    onClick={() => verDetalle(materia.id_materia)}
                                >
                                    <div className="materia-identificador">
                                        {materia.id_materia}
                                    </div>

                                    <div className="materia-info">
                                        <h3>{materia.nombre}</h3>

                                        <p>
                                            {materia.descripcion ||
                                                'Sin descripción disponible.'}
                                        </p>

                                        <span className="materia-ver-detalle">
                                            Ver detalle →
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="materias-paginacion">
                            <p>
                                Página {pagina} de {totalPaginas}
                            </p>

                            <div className="materias-paginacion-botones">
                                <button
                                    type="button"
                                    className="materias-boton secundario"
                                    disabled={pagina <= 1 || cargando}
                                    onClick={() =>
                                        setPagina((actual) => actual - 1)
                                    }
                                >
                                    Anterior
                                </button>

                                <button
                                    type="button"
                                    className="materias-boton"
                                    disabled={
                                        pagina >= totalPaginas || cargando
                                    }
                                    onClick={() =>
                                        setPagina((actual) => actual + 1)
                                    }
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </section>
        </main>
    )
}

export default Materias
