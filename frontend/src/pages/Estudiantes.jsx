
import { useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import {
    obtenerEstudiantes,
    obtenerEstudiantePorId,
    crearEstudiante,
    actualizarEstudiante,
    eliminarEstudiante
} from '../services/estudiantes'

function Estudiantes() {
    const [estudiantes, setEstudiantes] = useState([])
    const [totalRegistros, setTotalRegistros] = useState(0)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')

    const [busqueda, setBusqueda] = useState('')
    const [paginaActual, setPaginaActual] = useState(1)
    const [limite, setLimite] = useState(10)
    const [ordenarPor, setOrdenarPor] = useState('id_estudiante')
    const [direccionOrden, setDireccionOrden] = useState('ASC')

    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [estudianteEditando, setEstudianteEditando] = useState(null)
    const [errorFormulario, setErrorFormulario] = useState('')

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        foto_url: ''
    })

    const totalPaginas = Math.max(1, Math.ceil(totalRegistros / limite))

    const cargarEstudiantes = async () => {
        setCargando(true)
        setError('')

        try {
            const respuesta = await obtenerEstudiantes({
                pagina: paginaActual,
                limite,
                buscar: busqueda,
                orden: ordenarPor,
                direccion: direccionOrden
            })

            setEstudiantes(respuesta.datos || [])
            setTotalRegistros(respuesta.totalRegistros || 0)
        } catch (err) {
            console.error('Error al cargar estudiantes:', err)
            setEstudiantes([])
            setTotalRegistros(0)
            setError('No se pudieron cargar los estudiantes. Verificá que el backend esté funcionando.')
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => {
        const temporizador = setTimeout(() => {
            cargarEstudiantes()
        }, 300)

        return () => clearTimeout(temporizador)
    }, [paginaActual, limite, busqueda, ordenarPor, direccionOrden])

    const abrirFormularioCrear = () => {
        setEstudianteEditando(null)
        setFormData({
            nombre: '',
            apellido: '',
            email: '',
            password: '',
            foto_url: ''
        })
        setErrorFormulario('')
        setMostrarFormulario(true)
    }

    const abrirFormularioEditar = async (estudiante) => {
        try {
            setErrorFormulario('')

            const datos = await obtenerEstudiantePorId(estudiante.id_estudiante)
            const estudianteCompleto = datos.estudiante || datos

            setEstudianteEditando(estudianteCompleto)
            setFormData({
                nombre: estudianteCompleto.nombre || '',
                apellido: estudianteCompleto.apellido || '',
                email: estudianteCompleto.email || '',
                password: '',
                foto_url: estudianteCompleto.foto_url || ''
            })

            setMostrarFormulario(true)
        } catch (err) {
            setError(err.message || 'No se pudieron obtener los datos del estudiante.')
        }
    }

    const guardarEstudiante = async (e) => {
        e.preventDefault()
        setErrorFormulario('')

        try {
            const datos = { ...formData }

            // Si estamos editando y la contraseña está vacía, no la enviamos.
            if (estudianteEditando && !datos.password) {
                delete datos.password
            }

            if (estudianteEditando) {
                await actualizarEstudiante(estudianteEditando.id_estudiante, datos)
            } else {
                await crearEstudiante(datos)
            }

            setMostrarFormulario(false)
            await cargarEstudiantes()
        } catch (err) {
            setErrorFormulario(err.message || 'No se pudieron guardar los datos.')
        }
    }

    const confirmarEliminacion = async (id) => {
        const confirmar = window.confirm(
            '¿Querés eliminar este estudiante de forma permanente?'
        )

        if (!confirmar) return

        try {
            await eliminarEstudiante(id)
            await cargarEstudiantes()
        } catch (err) {
            setError(err.message || 'No se pudo eliminar el estudiante.')
        }
    }

    const exportarPDF = () => {
        const documento = new jsPDF()

        documento.setFontSize(18)
        documento.text('Listado de estudiantes', 14, 20)

        documento.setFontSize(10)
        let posicionY = 32

        if (estudiantes.length === 0) {
            documento.text('No hay estudiantes para exportar.', 14, posicionY)
        } else {
            estudiantes.forEach((estudiante) => {
                const texto = `#${estudiante.id_estudiante} | ${estudiante.nombre} ${estudiante.apellido} | ${estudiante.email}`

                const lineas = documento.splitTextToSize(texto, 180)

                if (posicionY + lineas.length * 6 > 280) {
                    documento.addPage()
                    posicionY = 20
                }

                documento.text(lineas, 14, posicionY)
                posicionY += lineas.length * 6 + 3
            })
        }

        documento.save('listado_estudiantes.pdf')
    }

    return (
        <div className="page-container">
            <h2 className="page-title">
                Gestión de <span className="highlight">Estudiantes</span>
            </h2>

            <p style={{ marginBottom: '24px', color: 'var(--color-text)' }}>
                Administración y consulta de los estudiantes registrados en el sistema.
            </p>

            <div
                style={{
                    background: 'var(--color-background)',
                    padding: '20px',
                    borderRadius: 'var(--radius-card)',
                    border: '1px solid var(--color-border)',
                    marginBottom: '24px'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                        marginBottom: '16px'
                    }}
                >
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <label
                            style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                marginBottom: '6px'
                            }}
                        >
                            Buscar estudiante
                        </label>

                        <input
                            type="text"
                            placeholder="Nombre, apellido o email..."
                            value={busqueda}
                            onChange={(e) => {
                                setBusqueda(e.target.value)
                                setPaginaActual(1)
                            }}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                border: '1px solid var(--color-border)',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ flex: '1', minWidth: '150px' }}>
                        <label
                            style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                marginBottom: '6px'
                            }}
                        >
                            Ordenar por
                        </label>

                        <select
                            value={ordenarPor}
                            onChange={(e) => setOrdenarPor(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                border: '1px solid var(--color-border)'
                            }}
                        >
                            <option value="id_estudiante">ID</option>
                            <option value="nombre">Nombre</option>
                            <option value="apellido">Apellido</option>
                            <option value="email">Email</option>
                        </select>
                    </div>

                    <div style={{ flex: '1', minWidth: '150px' }}>
                        <label
                            style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                marginBottom: '6px'
                            }}
                        >
                            Dirección
                        </label>

                        <select
                            value={direccionOrden}
                            onChange={(e) => setDireccionOrden(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                border: '1px solid var(--color-border)'
                            }}
                        >
                            <option value="ASC">Ascendente</option>
                            <option value="DESC">Descendente</option>
                        </select>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid var(--color-border)',
                        paddingTop: '16px',
                        flexWrap: 'wrap',
                        gap: '16px'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 'bold' }}>
                            Mostrar:
                        </label>

                        <select
                            value={limite}
                            onChange={(e) => {
                                setLimite(Number(e.target.value))
                                setPaginaActual(1)
                            }}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '4px',
                                border: '1px solid var(--color-border)'
                            }}
                        >
                            <option value={5}>5 registros</option>
                            <option value={10}>10 registros</option>
                            <option value={20}>20 registros</option>
                        </select>

                        <span style={{ fontSize: '14px', color: 'var(--color-secondary)' }}>
                            Total: {totalRegistros}
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                            onClick={exportarPDF}
                            style={{
                                padding: '10px 16px',
                                borderRadius: 'var(--radius-button)',
                                border: '1px solid var(--color-border)',
                                background: 'white',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Descargar PDF
                        </button>

                        <button onClick={abrirFormularioCrear} className="btn-primario">
                            + Nuevo estudiante
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <p role="alert" style={{ color: 'var(--color-terracotta)' }}>
                    {error}
                </p>
            )}

            <div
                style={{
                    overflowX: 'auto',
                    background: 'var(--color-background)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-card)',
                    padding: '16px'
                }}
            >
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        textAlign: 'left',
                        minWidth: '650px'
                    }}
                >
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                            <th style={{ padding: '12px', color: 'var(--color-secondary)' }}>ID</th>
                            <th style={{ padding: '12px', color: 'var(--color-secondary)' }}>Nombre completo</th>
                            <th style={{ padding: '12px', color: 'var(--color-secondary)' }}>Email</th>
                            <th style={{ padding: '12px', color: 'var(--color-secondary)' }}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {cargando ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '32px' }}>
                                    Cargando estudiantes...
                                </td>
                            </tr>
                        ) : estudiantes.length > 0 ? (
                            estudiantes.map((estudiante) => (
                                <tr
                                    key={estudiante.id_estudiante}
                                    style={{ borderBottom: '1px solid var(--color-border)' }}
                                >
                                    <td style={{ padding: '12px' }}>
                                        #{estudiante.id_estudiante}
                                    </td>

                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>
                                        {estudiante.nombre} {estudiante.apellido}
                                    </td>

                                    <td style={{ padding: '12px' }}>{estudiante.email}</td>

                                    <td style={{ padding: '12px' }}>
                                        <button
                                            onClick={() => abrirFormularioEditar(estudiante)}
                                            style={{
                                                marginRight: '12px',
                                                cursor: 'pointer',
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--color-primary)',
                                                fontWeight: 'bold',
                                                textDecoration: 'underline'
                                            }}
                                        >
                                            Ver / Editar
                                        </button>

                                        <button
                                            onClick={() => confirmarEliminacion(estudiante.id_estudiante)}
                                            style={{
                                                cursor: 'pointer',
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--color-terracotta)',
                                                fontWeight: 'bold',
                                                textDecoration: 'underline'
                                            }}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '32px' }}>
                                    No hay estudiantes que coincidan con la búsqueda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '24px',
                    gap: '16px'
                }}
            >
                <button
                    disabled={paginaActual === 1}
                    onClick={() => setPaginaActual((pagina) => pagina - 1)}
                >
                    Página anterior
                </button>

                <span style={{ fontWeight: 'bold' }}>
                    Página {paginaActual} de {totalPaginas}
                </span>

                <button
                    disabled={paginaActual >= totalPaginas}
                    onClick={() => setPaginaActual((pagina) => pagina + 1)}
                >
                    Página siguiente
                </button>
            </div>

            {mostrarFormulario && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        overflowY: 'auto',
                        padding: '20px'
                    }}
                >
                    <div
                        style={{
                            background: 'white',
                            padding: '32px',
                            borderRadius: 'var(--radius-card)',
                            width: '100%',
                            maxWidth: '600px',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}
                    >
                        <h3>
                            {estudianteEditando
                                ? 'Visualización y edición del estudiante'
                                : 'Alta de nuevo estudiante'}
                        </h3>

                        {errorFormulario && (
                            <p role="alert" style={{ color: 'var(--color-terracotta)' }}>
                                {errorFormulario}
                            </p>
                        )}

                        <form
                            onSubmit={guardarEstudiante}
                            style={{ display: 'grid', gap: '16px' }}
                        >
                            <div>
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) =>
                                        setFormData({ ...formData, nombre: e.target.value })
                                    }
                                    required
                                    style={{ display: 'block', width: '100%', padding: '10px', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label>Apellido</label>
                                <input
                                    type="text"
                                    value={formData.apellido}
                                    onChange={(e) =>
                                        setFormData({ ...formData, apellido: e.target.value })
                                    }
                                    required
                                    style={{ display: 'block', width: '100%', padding: '10px', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label>Correo electrónico</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    required
                                    style={{ display: 'block', width: '100%', padding: '10px', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label>
                                    Contraseña {estudianteEditando && '(Dejar en blanco para conservar la actual)'}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    required={!estudianteEditando}
                                    autoComplete="new-password"
                                    style={{ display: 'block', width: '100%', padding: '10px', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label>URL de la foto (opcional)</label>
                                <input
                                    type="url"
                                    value={formData.foto_url}
                                    onChange={(e) =>
                                        setFormData({ ...formData, foto_url: e.target.value })
                                    }
                                    style={{ display: 'block', width: '100%', padding: '10px', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => setMostrarFormulario(false)}
                                >
                                    Cancelar
                                </button>

                                <button type="submit" className="btn-primario">
                                    {estudianteEditando ? 'Guardar cambios' : 'Crear estudiante'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Estudiantes
