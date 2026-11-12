import { useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function Materias() {
    // estados para los datos y la tabla
    const [materias, setMaterias] = useState([])
    const [materiasFiltradas, setMateriasFiltradas] = useState([])
    const [totalRegistros, setTotalRegistros] = useState(0)
    const [cargando, setCargando] = useState(true)

    // estados para paginacion, busqueda y filtros
    const [busqueda, setBusqueda] = useState('')
    const [paginaActual, setPaginaActual] = useState(1)
    const [limite, setLimite] = useState(10)
    const [ordenarPor, setOrdenarPor] = useState('id_materia')
    const [direccionOrden, setDireccionOrden] = useState('ASC')

    // estados para el formulario (crear/editar)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [materiaEditando, setMateriaEditando] = useState(null)
    const [errorFormulario, setErrorFormulario] = useState('')

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    })

    // estados adicionales para manejar los datos localmente
    const [todasLasMaterias, setTodasLasMaterias] = useState([])
    const obtenerMaterias = async () => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')

            const respuesta = await fetch('http://localhost:3000/api/materias?limite=100&pagina=1', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const datos = await respuesta.json()

            if (respuesta.ok) {
                setTodasLasMaterias(datos.datos || [])
            } else {
                setTodasLasMaterias([])
            }
        } catch (error) {
            console.error('Error al cargar materias:', error)
            setTodasLasMaterias([])
        } finally {
            setCargando(false)
        }
    }

    // solo busca en el backend cuando entramos a la pagina o cuando guardamos/eliminamos algo
    useEffect(() => {
        obtenerMaterias()
    }, [])

    // filtra tildes, ordena alfabeticamente y pagina la tabla
    useEffect(() => {
        let resultado = [...todasLasMaterias]

        // Función para sacar tildes y mayúsculas
        const normalizar = (texto) => {
            if (!texto) return '';
            return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        }

        // busqueda
        if (busqueda) {
            const termino = normalizar(busqueda)
            resultado = resultado.filter(mat => 
                normalizar(mat.nombre).includes(termino) || 
                normalizar(mat.descripcion).includes(termino)
            )
        }

        resultado.sort((a, b) => {
            let valA = a[ordenarPor]
            let valB = b[ordenarPor]
            
            if (typeof valA === 'string') valA = normalizar(valA)
            if (typeof valB === 'string') valB = normalizar(valB)

            if (valA < valB) return direccionOrden === 'ASC' ? -1 : 1
            if (valA > valB) return direccionOrden === 'ASC' ? 1 : -1
            return 0
        })

        setTotalRegistros(resultado.length)
        setMateriasFiltradas(resultado)

        // paginacion
        const indiceInicio = (paginaActual - 1) * limite
        const indiceFin = indiceInicio + limite
        setMaterias(resultado.slice(indiceInicio, indiceFin))

    }, [todasLasMaterias, busqueda, paginaActual, limite, ordenarPor, direccionOrden])

    // generar PDF profesional
    const exportarPDF = () => {
        try {
            const doc = new jsPDF()
            
            doc.setFontSize(18)
            doc.setTextColor(36, 69, 0)
            doc.text('Profy - Reporte de Materias', 14, 22)
            
            doc.setFontSize(10)
            doc.setTextColor(100)
            const fecha = new Date().toLocaleDateString('es-AR')
            doc.text(`Generado el: ${fecha}`, 14, 30)

            if (!materiasFiltradas || materiasFiltradas.length === 0) {
                doc.text('No hay materias registradas para exportar.', 14, 45)
                doc.save('Profy_Listado_Materias.pdf')
                return
            }

            const columnas = ["ID", "Nombre de la Materia", "Descripción"]
            const filas = materiasFiltradas.map(mat => [
                mat.id_materia || '-',
                mat.nombre || 'Sin Nombre',
                mat.descripcion || 'Sin descripción'
            ])

            autoTable(doc, {
                startY: 38,
                head: [columnas],
                body: filas,
                theme: 'grid',
                headStyles: { fillColor: [36, 69, 0] },
                alternateRowStyles: { fillColor: [245, 245, 245] },
                styles: { fontSize: 10, cellPadding: 4 }
            })
            
            doc.save(`Profy_Materias_${fecha.replace(/\//g, '-')}.pdf`)
        } catch (error) {
            console.error('Error al generar PDF:', error)
            alert('Hubo un problema al generar el archivo PDF.')
        }
    }

    // manejo del formulario (abrir y cargar datos)
    const abrirFormularioCrear = () => {
        setMateriaEditando(null)
        setFormData({ nombre: '', descripcion: '' })
        setErrorFormulario('')
        setMostrarFormulario(true)
    }

    const abrirFormularioEditar = (materia) => {
        setMateriaEditando(materia)
        setFormData({
            nombre: materia.nombre || '',
            descripcion: materia.descripcion || ''
        })
        setErrorFormulario('')
        setMostrarFormulario(true)
    }

    // enviar datos al backend (POST / PUT)
    const guardarMateria = async (e) => {
        e.preventDefault()
        setErrorFormulario('')

        const token = localStorage.getItem('token')
        const url = materiaEditando 
            ? `http://localhost:3000/api/materias/${materiaEditando.id_materia}`
            : 'http://localhost:3000/api/materias'
        
        const method = materiaEditando ? 'PUT' : 'POST'

        try {
            const respuesta = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            const resultado = await respuesta.json()

            if (!respuesta.ok) {
                throw new Error(resultado.mensaje || 'Error al guardar los datos')
            }

            setMostrarFormulario(false)
            obtenerMaterias() // recargar la tabla
        } catch (err) {
            setErrorFormulario(err.message)
        }
    }

    // eliminar (DELETE)
    const eliminarMateria = async (id) => {
        if (!window.confirm('¿Estás segura de que querés eliminar esta materia de forma permanente?')) return

        const token = localStorage.getItem('token')
        try {
            const respuesta = await fetch(`http://localhost:3000/api/materias/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (!respuesta.ok) {
                const errorData = await respuesta.json()
                throw new Error(errorData.mensaje || 'Error al eliminar')
            }

            obtenerMaterias()
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <div className="page-container">
            <h2 className="page-title">Gestión de <span className="highlight">Materias</span></h2>
            <p style={{ marginBottom: '24px', color: 'var(--color-text)' }}>Administración y control total de las materias disponibles en la plataforma.</p>

            {/* herramientas y filtros */}
            <div style={{ background: 'var(--color-background)', padding: '20px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)', marginBottom: '24px' }}>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                    {/* Búsqueda por texto */}
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Buscar materia</label>
                        <input 
                            type="text" 
                            placeholder="Ej: Matemática, Historia..." 
                            value={busqueda}
                            onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    {/* ordenamiento */}
                    <div style={{ flex: '1', minWidth: '150px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Ordenar por</label>
                        <select 
                            value={ordenarPor} 
                            onChange={(e) => setOrdenarPor(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                        >
                            <option value="id_materia">ID de Materia</option>
                            <option value="nombre">Nombre</option>
                        </select>
                    </div>

                    <div style={{ flex: '1', minWidth: '150px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Dirección</label>
                        <select 
                            value={direccionOrden} 
                            onChange={(e) => setDireccionOrden(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                        >
                            <option value="ASC">Ascendente</option>
                            <option value="DESC">Descendente</option>
                        </select>
                    </div>
                </div>

                {/* paginacion y botones */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '16px', flexWrap: 'wrap', gap: '16px' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Mostrar:</label>
                        <select 
                            value={limite} 
                            onChange={(e) => { setLimite(Number(e.target.value)); setPaginaActual(1); }}
                            style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                        >
                            <option value={5}>5 registros</option>
                            <option value={10}>10 registros</option>
                            <option value={20}>20 registros</option>
                        </select>
                        <span style={{ fontSize: '14px', color: 'var(--color-secondary)' }}>
                            (Total: {totalRegistros} encontrados)
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={exportarPDF} style={{ padding: '10px 16px', borderRadius: 'var(--radius-button)', border: '1px solid var(--color-border)', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                            Descargar PDF
                        </button>
                        <button onClick={abrirFormularioCrear} className="btn-primario">
                            + Nuevo Registro
                        </button>
                    </div>
                </div>
            </div>

            {/* tabla de registros */}
            <div style={{ overflowX: 'auto', background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', padding: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                            <th style={{ padding: '12px', color: 'var(--color-secondary)' }}>ID</th>
                            <th style={{ padding: '12px', color: 'var(--color-secondary)' }}>Materia</th>
                            <th style={{ padding: '12px', color: 'var(--color-secondary)' }}>Descripción</th>
                            <th style={{ padding: '12px', color: 'var(--color-secondary)' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '32px' }}>Sincronizando con la base de datos...</td></tr>
                        ) : materias.length > 0 ? (
                            materias.map((mat) => (
                                <tr key={mat.id_materia} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '12px' }}>#{mat.id_materia}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{mat.nombre}</td>
                                    <td style={{ padding: '12px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {mat.descripcion || <span style={{color: '#999'}}>Sin descripción</span>}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <button onClick={() => abrirFormularioEditar(mat)} style={{ marginRight: '12px', cursor: 'pointer', background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 'bold', textDecoration: 'underline' }}>Editar</button>
                                        <button onClick={() => eliminarMateria(mat.id_materia)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--color-terracotta)', fontWeight: 'bold', textDecoration: 'underline' }}>Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '32px' }}>No hay registros que coincidan con la búsqueda.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* controles de pagina */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '24px', gap: '16px' }}>
                <button 
                    disabled={paginaActual === 1}
                    onClick={() => setPaginaActual(paginaActual - 1)}
                    style={{ padding: '8px 16px', borderRadius: 'var(--radius-button)', border: '1px solid var(--color-border)', cursor: paginaActual === 1 ? 'not-allowed' : 'pointer', background: 'white' }}
                >
                    Página Anterior
                </button>
                <span style={{ fontWeight: 'bold' }}>
                    Página {paginaActual} de {Math.max(1, Math.ceil(totalRegistros / limite))}
                </span>
                <button 
                    disabled={paginaActual >= Math.ceil(totalRegistros / limite)}
                    onClick={() => setPaginaActual(paginaActual + 1)}
                    style={{ padding: '8px 16px', borderRadius: 'var(--radius-button)', border: '1px solid var(--color-border)', cursor: paginaActual >= Math.ceil(totalRegistros / limite) ? 'not-allowed' : 'pointer', background: 'white' }}
                >
                    Página Siguiente
                </button>
            </div>

            {/* ventana de edicion modal */}
            {mostrarFormulario && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, overflowY: 'auto', padding: '20px' }}>
                    <div style={{ background: 'white', padding: '32px', borderRadius: 'var(--radius-card)', width: '100%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        
                        <h3 style={{ marginTop: 0, borderBottom: '2px solid var(--color-border)', paddingBottom: '12px', marginBottom: '20px' }}>
                            {materiaEditando ? 'Visualización y Edición de Materia' : 'Alta de Nueva Materia'}
                        </h3>
                        
                        {errorFormulario && (
                            <div style={{ color: 'var(--color-terracotta)', background: '#ffe9e9', padding: '12px', borderRadius: '6px', fontSize: '14px', marginBottom: '20px', border: '1px solid var(--color-terracotta)' }}>
                                {errorFormulario}
                            </div>
                        )}

                        <form onSubmit={guardarMateria} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Nombre de la Materia</label>
                                <input 
                                    type="text" 
                                    value={formData.nombre} 
                                    onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                                    required 
                                    placeholder="Ej: Análisis Matemático I"
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Descripción</label>
                                <textarea 
                                    rows="4" 
                                    value={formData.descripcion} 
                                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})} 
                                    placeholder="Agregá detalles o el enfoque de la materia..."
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'vertical' }} 
                                />
                            </div>

                            {/* Botones del formulario */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                                <button type="button" onClick={() => setMostrarFormulario(false)} style={{ padding: '10px 20px', borderRadius: 'var(--radius-button)', border: '1px solid var(--color-border)', cursor: 'pointer', background: '#f5f5f5', fontWeight: 'bold' }}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primario" style={{ padding: '10px 24px' }}>
                                    {materiaEditando ? 'Actualizar Registro' : 'Confirmar Alta'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Materias