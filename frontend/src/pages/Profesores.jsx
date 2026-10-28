import { useState, useEffect } from 'react'
// import jsPDF from 'jspdf' // libreria para generar pdfs

    function Profesores() {
    // estados para los datos y la tabla
    const [profesores, setProfesores] = useState([])
    const [totalRegistros, setTotalRegistros] = useState(0)
    const [cargando, setCargando] = useState(true)

    // estados para paginacion, busqueda y filtros
    const [busqueda, setBusqueda] = useState('')
    const [paginaActual, setPaginaActual] = useState(1)
    const [limite, setLimite] = useState(10)
    const [modalidadFiltro, setModalidadFiltro] = useState('') 
    const [ordenarPor, setOrdenarPor] = useState('id_profesor')
    const [direccionOrden, setDireccionOrden] = useState('ASC')

    // estados para el formulario (crear/editar)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [profesorEditando, setProfesorEditando] = useState(null)
    const [errorFormulario, setErrorFormulario] = useState('')

    const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    descripcion: '',
    precio_hora: '',
    modalidad: 'Virtual',
    ubicacion: ''
    })

    // conexion con el backend (traer lista)
    const obtenerProfesores = async () => {
        setCargando(true)
        try {
        let url = `http://localhost:3000/api/profesores?page=${paginaActual}&limit=${limite}&sortBy=${ordenarPor}&order=${direccionOrden}`
        
        if (busqueda) url += `&nombre=${busqueda}`
        if (modalidadFiltro) url += `&modalidad=${modalidadFiltro}`

        const respuesta = await fetch(url)
        const datos = await respuesta.json()

        if (respuesta.ok) {
            setProfesores(datos.profesores)
            setTotalRegistros(datos.totalRegistros)
        } else {
            setProfesores([])
            setTotalRegistros(0)
        }
        } catch (error) {
        console.error('Error al cargar profesores:', error)
        setProfesores([])
        setTotalRegistros(0)
        } finally {
        setCargando(false)
        }
    }

    // se vuelve a ejecutar cada vez que cambia algun filtro o la pagina
    useEffect(() => {
        const timer = setTimeout(() => {
        obtenerProfesores()
        }, 300) 
        return () => clearTimeout(timer)
    }, [paginaActual, limite, busqueda, modalidadFiltro, ordenarPor, direccionOrden])

    // generar PDF 
    const exportarPDF = () => {
        const doc = new jsPDF()
        
        // titulo del documento
        doc.setFontSize(18)
        doc.text('Reporte de Profesores', 14, 20)
        
        // lista de texto simple con los datos cargados
        doc.setFontSize(12)
        let posicionY = 30
        
        if (profesores.length === 0) {
        doc.text('No hay profesores para exportar.', 14, posicionY)
        } else {
        profesores.forEach((prof) => {
            const texto = `ID: ${prof.id_profesor} | ${prof.nombre} ${prof.apellido} | ${prof.email} | Mod: ${prof.modalidad}`
            doc.text(texto, 14, posicionY)
            posicionY += 10
            
            // si llega al final de la hoja, crea una nueva
            if (posicionY > 280) {
            doc.addPage()
            posicionY = 20
            }
        })
        }
        // descarga el archivo
        doc.save('listado_profesores.pdf')
    }

    // manejo del formulario (abrir y cargar datos)
    const abrirFormularioCrear = () => {
        setProfesorEditando(null)
        setFormData({ nombre: '', apellido: '', email: '', password: '', descripcion: '', precio_hora: '', modalidad: 'Virtual', ubicacion: '' })
        setErrorFormulario('')
        setMostrarFormulario(true)
    }

    const abrirFormularioEditar = (profesor) => {
        setProfesorEditando(profesor)
        setFormData({
        nombre: profesor.nombre || '',
        apellido: profesor.apellido || '',
        email: profesor.email || '',
        password: '', 
        descripcion: profesor.descripcion || '',
        precio_hora: profesor.precio_hora || '',
        modalidad: profesor.modalidad || 'Virtual',
        ubicacion: profesor.ubicacion || ''
        })
        setErrorFormulario('')
        setMostrarFormulario(true)
    }

    // enviar datos al backend (POST / PUT)
    const guardarProfesor = async (e) => {
        e.preventDefault()
        setErrorFormulario('')

        const token = localStorage.getItem('token')
        const url = profesorEditando 
        ? `http://localhost:3000/api/profesores/${profesorEditando.id_profesor}`
        : 'http://localhost:3000/api/profesores'
        
        const method = profesorEditando ? 'PUT' : 'POST'

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
        obtenerProfesores() // recargar la tabla para ver los cambios
        } catch (err) {
        setErrorFormulario(err.message)
        }
    }

    // eliminar (DELETE)
    const eliminarProfesor = async (id) => {
        if (!window.confirm('¿Estás segura de que querés eliminar este profesor de forma permanente?')) return

        const token = localStorage.getItem('token')
        try {
        const respuesta = await fetch(`http://localhost:3000/api/profesores/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!respuesta.ok) {
            const errorData = await respuesta.json()
            throw new Error(errorData.mensaje || 'Error al eliminar')
        }

        obtenerProfesores()
        } catch (err) {
        alert(err.message)
        }
    }

    return (
        <div className="page-container">
        <h2 className="page-title">Gestión de <span className="highlight">Profesores</span></h2>
        <p style={{ marginBottom: '24px', color: 'var(--color-text)' }}>Administración y control total de los docentes del sistema.</p>

        {/* herramientas y filtros */}
        <div style={{ background: 'var(--color-background)', padding: '20px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)', marginBottom: '24px' }}>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            {/* Búsqueda por texto */}
            <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Buscar profesor</label>
                <input 
                type="text" 
                placeholder="Ej: Juan Pérez..." 
                value={busqueda}
                onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                />
            </div>

            {/* filtro por modalidad */}
            <div style={{ flex: '1', minWidth: '150px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Modalidad</label>
                <select 
                value={modalidadFiltro} 
                onChange={(e) => { setModalidadFiltro(e.target.value); setPaginaActual(1); }}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                >
                <option value="">Todas</option>
                <option value="Virtual">Virtual</option>
                <option value="Presencial">Presencial</option>
                <option value="Mixta">Mixta</option>
                </select>
            </div>

            {/* ordenamiento */}
            <div style={{ flex: '1', minWidth: '150px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Ordenar por</label>
                <select 
                value={ordenarPor} 
                onChange={(e) => setOrdenarPor(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                >
                <option value="id_profesor">ID de Profesor</option>
                <option value="nombre">Nombre</option>
                <option value="precio_hora">Precio por Hora</option>
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
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '12px', color: 'var(--color-secondary)' }}>ID</th>
                <th style={{ padding: '12px', color: 'var(--color-secondary)' }}>Nombre Completo</th>
                <th style={{ padding: '12px', color: 'var(--color-secondary)' }}>Email</th>
                <th style={{ padding: '12px', color: 'var(--color-secondary)' }}>Modalidad</th>
                <th style={{ padding: '12px', color: 'var(--color-secondary)' }}>Tarifa/Hora</th>
                <th style={{ padding: '12px', color: 'var(--color-secondary)' }}>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {cargando ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>Sincronizando con la base de datos...</td></tr>
                ) : profesores.length > 0 ? (
                profesores.map((prof) => (
                    <tr key={prof.id_profesor} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px' }}>#{prof.id_profesor}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{prof.nombre} {prof.apellido}</td>
                    <td style={{ padding: '12px' }}>{prof.email}</td>
                    <td style={{ padding: '12px' }}>{prof.modalidad}</td>
                    <td style={{ padding: '12px' }}>${prof.precio_hora}</td>
                    <td style={{ padding: '12px' }}>
                        <button onClick={() => abrirFormularioEditar(prof)} style={{ marginRight: '12px', cursor: 'pointer', background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 'bold', textDecoration: 'underline' }}>Editar</button>
                        <button onClick={() => eliminarProfesor(prof.id_profesor)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--color-terracotta)', fontWeight: 'bold', textDecoration: 'underline' }}>Eliminar</button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>No hay registros que coincidan con la búsqueda.</td></tr>
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

        {/* ventana de edicion*/}
        {mostrarFormulario && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, overflowY: 'auto', padding: '20px' }}>
            <div style={{ background: 'white', padding: '32px', borderRadius: 'var(--radius-card)', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                
                <h3 style={{ marginTop: 0, borderBottom: '2px solid var(--color-border)', paddingBottom: '12px', marginBottom: '20px' }}>
                {profesorEditando ? 'Visualización y Edición del Registro' : 'Alta de Nuevo Profesor'}
                </h3>
                
                {errorFormulario && (
                <div style={{ color: 'var(--color-terracotta)', background: '#ffe9e9', padding: '12px', borderRadius: '6px', fontSize: '14px', marginBottom: '20px', border: '1px solid var(--color-terracotta)' }}>
                    {errorFormulario}
                </div>
                )}

                <form onSubmit={guardarProfesor} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                
                <div style={{ gridColumn: '1 / 2' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Nombre</label>
                    <input type="text" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                </div>

                <div style={{ gridColumn: '2 / 3' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Apellido</label>
                    <input type="text" value={formData.apellido} onChange={(e) => setFormData({...formData, apellido: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                </div>

                <div style={{ gridColumn: '1 / 3' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Correo Electrónico</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                </div>

                <div style={{ gridColumn: '1 / 3' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>
                    Contraseña de Acceso {profesorEditando && <span style={{color: 'gray', fontWeight: 'normal'}}>(Dejar en blanco para conservar la actual)</span>}
                    </label>
                    <input type="password" placeholder="********" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} {...(!profesorEditando && { required: true })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                </div>

                <div style={{ gridColumn: '1 / 3' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Descripción / Perfil Profesional</label>
                    <textarea rows="3" value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>

                <div style={{ gridColumn: '1 / 2' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Modalidad de Clases</label>
                    <select value={formData.modalidad} onChange={(e) => setFormData({...formData, modalidad: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
                    <option value="Virtual">Virtual</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Mixta">Mixta</option>
                    </select>
                </div>

                <div style={{ gridColumn: '2 / 3' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Tarifa por Hora ($)</label>
                    <input type="number" step="100" min="0" value={formData.precio_hora} onChange={(e) => setFormData({...formData, precio_hora: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                </div>

                <div style={{ gridColumn: '1 / 3' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Ubicación Física / Zona</label>
                    <input type="text" placeholder="Ej: Centro, Bahía Blanca" value={formData.ubicacion} onChange={(e) => setFormData({...formData, ubicacion: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                </div>

                {/* Botones del formulario */}
                <div style={{ gridColumn: '1 / 3', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                    <button type="button" onClick={() => setMostrarFormulario(false)} style={{ padding: '10px 20px', borderRadius: 'var(--radius-button)', border: '1px solid var(--color-border)', cursor: 'pointer', background: '#f5f5f5', fontWeight: 'bold' }}>
                    Descartar Cambios
                    </button>
                    <button type="submit" className="btn-primario" style={{ padding: '10px 24px' }}>
                    {profesorEditando ? 'Actualizar Registro' : 'Confirmar Alta'}
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}

        </div>
    )
    }
    export default Profesores