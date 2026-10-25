import { useEffect, useState } from 'react'
import {
    obtenerMaterias,
    obtenerMateriaPorId,
    actualizarMateria,
    eliminarMateria
} from '../services/materias'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
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

    const [modoEdicion, setModoEdicion] = useState(false)
    const [nombreEditado, setNombreEditado] = useState('')
    const [descripcionEditada, setDescripcionEditada] = useState('')
    const [guardando, setGuardando] = useState(false)

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
            const materia = datos.materia || datos
            
            setMateriaDetalle(materia)
            setNombreEditado(materia.nombre || '')
            setDescripcionEditada(materia.descripcion || '')
            setModoEdicion(false)
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

    const guardarCambios = async () => {
    const nombre = nombreEditado.trim()
    const descripcion = descripcionEditada.trim()

    if (!nombre) {
        setErrorDetalle('El nombre de la materia es obligatorio.')
        return
    }

    setGuardando(true)
    setErrorDetalle('')

    try {
        const token = localStorage.getItem('token')

        if (!token) {
            setErrorDetalle(
                'Todavía no hay un token de sesión. El guardado se podrá probar cuando se conecte el login.'
            )
            return
        }

        const respuesta = await actualizarMateria(
            idMateriaSeleccionada,
            { nombre, descripcion },
            token
        )

        const materiaActualizada =
            respuesta.materia || respuesta

        setMateriaDetalle(materiaActualizada)
        setNombreEditado(materiaActualizada.nombre || '')
        setDescripcionEditada(materiaActualizada.descripcion || '')
        setModoEdicion(false)
    } catch (error) {
        setErrorDetalle(
            error.message || 'No se pudieron guardar los cambios.'
        )
    } finally {
        setGuardando(false)
    }
}

    const confirmarEliminacion = async () => {
    const confirmar = window.confirm(
        `¿Estás segura de que querés eliminar la materia "${materiaDetalle.nombre}"?`
    )

    if (!confirmar) return

    setErrorDetalle('')
    setGuardando(true)

    try {
        const token = localStorage.getItem('token')

        if (!token) {
            setErrorDetalle(
                'No hay un token de sesión. El login debe estar conectado para eliminar materias.'
            )
            return
        }

        await eliminarMateria(idMateriaSeleccionada, token)

        setMostrarDetalle(false)
        setMateriaDetalle(null)
        setModoEdicion(false)
        setPagina(1)
        setIntento((anterior) => anterior + 1)
    } catch (error) {
        setErrorDetalle(
            error.message || 'No se pudo eliminar la materia.'
        )
    } finally {
        setGuardando(false)
    }
}

const exportarPDF = async () => {
    try {
        let listaMaterias = []
        let paginaActual = 1
        let totalPaginasExportacion = 1

        while (paginaActual <= totalPaginasExportacion) {
            const datos = await obtenerMaterias({
                pagina: paginaActual,
                limite: 100,
                buscar,
                orden,
                direccion
            })

            const materiasPagina = datos.datos || []

            listaMaterias = [...listaMaterias, ...materiasPagina]

            totalPaginasExportacion = datos.totalPaginas || 1
            paginaActual++
        }

        if (listaMaterias.length === 0) {
            alert('No hay materias para exportar.')
            return
        }

        const documento = new jsPDF()

        documento.setFontSize(16)
        documento.text('Listado completo de materias', 14, 15)

        documento.setFontSize(10)
        documento.text(`Total de materias: ${listaMaterias.length}`, 14, 23)

        autoTable(documento, {
            startY: 30,
            head: [['ID', 'Nombre', 'Descripción']],
            body: listaMaterias.map((materia) => [
                materia.id_materia,
                materia.nombre,
                materia.descripcion || 'Sin descripción'
            ]),
            styles: {
                fontSize: 9,
                cellPadding: 3,
                overflow: 'linebreak'
            },
            headStyles: {
                fillColor: [50, 70, 100]
            },
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: 45 },
                2: { cellWidth: 'auto' }
            },
            margin: { top: 15, right: 14, bottom: 15, left: 14 }
        })

        documento.save('listado-completo-materias.pdf')
    } catch (error) {
        alert(error.message || 'No se pudo generar el PDF.')
    }
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
                                {modoEdicion ? (
                                    <input
                                    type="text"
                                    value={nombreEditado}
                                    onChange={(e) => setNombreEditado(e.target.value)}
                                    placeholder="Nombre de la materia"
                                    />
                                ) : (
                                <h2>{materiaDetalle.nombre}</h2>
                                )}
                                
                                <p>ID de materia: {materiaDetalle.id_materia}</p>
                                </div>
                        </div>
                        
                        <div className="materia-detalle-descripcion">
                            <h3>Descripción</h3>
                            
                            {modoEdicion ? (
                                <textarea
                                    value={descripcionEditada}
                                    onChange={(e) => setDescripcionEditada(e.target.value)}
                                    placeholder="Descripción de la materia"
                                    rows={4}
                                />
                            ) : (
                            <p>{materiaDetalle.descripcion || 'Sin descripción'}</p>
                            )}
                            </div>

                        <div className="materias-acciones">
                            {!modoEdicion ? (
                                <>
                                <button
                                type="button"
                                className="materias-boton"
                                onClick={() => setModoEdicion(true)}
                                >
                                    Editar materia
                                    </button>
                                    
                                    <button
                                    type="button"
                                    className="materias-boton secundario"
                                    onClick={confirmarEliminacion}
                                    disabled={guardando}
                                    >
                                        Eliminar materia
                                        </button>
                                        </>

                            ) : (
                            <>
                            <button
                            type="button"
                            className="materias-boton"
                            onClick={guardarCambios}
                            disabled={guardando}
                            >
                                {guardando ? 'Guardando...' : 'Guardar cambios'}
                                </button>
                                
                                <button
                                type="button"
                                className="materias-boton secundario"
                                onClick={() => {
                                    setNombreEditado(materiaDetalle.nombre || '')
                                    setDescripcionEditada(materiaDetalle.descripcion || '')
                                    setModoEdicion(false)
                                    setErrorDetalle('')
                                }}
                                disabled={guardando}
                                >
                                    Cancelar
                                    </button>
                                    </>
                                )}
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
                    
                    {!cargando && !error && totalRegistros > 0 && (
                        <button
                        type="button"
                        className="materias-boton"
                        onClick={exportarPDF}
                        >
                            Descargar listado
                            </button>
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
