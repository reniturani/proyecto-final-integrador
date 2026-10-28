import { useState, useEffect } from 'react'

    function Profesores() {
    const [profesores, setProfesores] = useState([])
    const [busqueda, setBusqueda] = useState('')
    const [cargando, setCargando] = useState(true)
    const [paginaActual, setPaginaActual] = useState(1)

    useEffect(() => {
        const obtenerProfesores = async () => {
        try {
            const respuesta = await fetch('http://localhost:3000/api/profesores')
            const datos = await respuesta.json()
            
            // Imprimimos en consola lo que llega para diagnosticar
            console.log('Datos que manda el backend:', datos)

            // Verificamos en qué formato viene la lista para evitar que se rompa
            if (Array.isArray(datos)) {
            setProfesores(datos)
            } else if (datos && Array.isArray(datos.profesores)) {
            setProfesores(datos.profesores) // Por si Fede lo envolvió en una propiedad "profesores"
            } else if (datos && Array.isArray(datos.data)) {
            setProfesores(datos.data) // Por si Fede lo envolvió en "data"
            } else {
            setProfesores([]) // Si viene otra cosa (ej: un error de permisos), dejamos la lista vacía
            }
        } catch (error) {
            console.error('Error al cargar los profesores:', error)
            setProfesores([])
        } finally {
            setCargando(false)
        }
        }

        obtenerProfesores()
    }, [])

    // Protegemos el filtro: solo filtramos si "profesores" es realmente un array válido
    const profesoresFiltrados = Array.isArray(profesores) 
        ? profesores.filter((prof) => {
            const nombre = prof.nombre || ''
            const email = prof.email || ''
            return nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                email.toLowerCase().includes(busqueda.toLowerCase())
        })
        : []

    const generarPDF = () => {
        alert('Generando reporte en PDF...')
    }

    return (
        <div className="page-container">
        <h2 className="page-title">Gestión de <span className="highlight">Profesores</span></h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <input 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ padding: '10px', borderRadius: 'var(--radius-button)', border: '1px solid var(--color-border)', width: '100%', maxWidth: '400px', fontSize: '15px' }}
            />
            <button onClick={generarPDF} className="btn-primario">
            Exportar a PDF
            </button>
        </div>

        <div style={{ overflowX: 'auto', background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', padding: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '12px', color: 'var(--color-secondary)' }}>ID</th>
                <th style={{ padding: '12px', color: 'var(--color-secondary)' }}>Nombre</th>
                <th style={{ padding: '12px', color: 'var(--color-secondary)' }}>Email</th>
                <th style={{ padding: '12px', color: 'var(--color-secondary)' }}>Modalidad</th>
                <th style={{ padding: '12px', color: 'var(--color-secondary)' }}>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {cargando ? (
                <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>Cargando profesores...</td>
                </tr>
                ) : profesoresFiltrados.length > 0 ? (
                profesoresFiltrados.map((prof) => (
                    <tr key={prof.id_profesor} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px' }}>{prof.id_profesor}</td>
                    <td style={{ padding: '12px' }}>{prof.nombre} {prof.apellido}</td>
                    <td style={{ padding: '12px' }}>{prof.email}</td>
                    <td style={{ padding: '12px' }}>{prof.modalidad}</td>
                    <td style={{ padding: '12px' }}>
                        <button style={{ marginRight: '12px', cursor: 'pointer', background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 'bold' }}>Editar</button>
                        <button style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--color-terracotta)', fontWeight: 'bold' }}>Eliminar</button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>No se encontraron resultados.</td>
                </tr>
                )}
            </tbody>
            </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '24px', gap: '16px' }}>
            <button 
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(paginaActual - 1)}
            style={{ padding: '8px 16px', borderRadius: 'var(--radius-button)', border: '1px solid var(--color-border)', cursor: paginaActual === 1 ? 'not-allowed' : 'pointer' }}
            >
            Anterior
            </button>
            <span style={{ fontWeight: 'bold', color: 'var(--color-secondary)' }}>Página {paginaActual}</span>
            <button 
            onClick={() => setPaginaActual(paginaActual + 1)}
            style={{ padding: '8px 16px', borderRadius: 'var(--radius-button)', border: '1px solid var(--color-border)', cursor: 'pointer' }}
            >
            Siguiente
            </button>
        </div>
        </div>
    )
    }

    export default Profesores