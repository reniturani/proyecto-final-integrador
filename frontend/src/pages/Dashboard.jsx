import { useState, useEffect } from 'react'

import { obtenerMaterias } from '../services/materias'
import { obtenerEstudiantes } from '../services/estudiantes'

function Dashboard({ onNavegar }) {
    const [estadisticas, setEstadisticas] = useState({
        totalProfesores: 0,
        totalMaterias: 0,
        totalEstudiantes: 0,
        precioPromedio: 0,
        modalidades: {
            Virtual: 0,
            Presencial: 0,
            Mixta: 0
        }
    })
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function cargarDatosDashboard() {
            setCargando(true)
            setError('')
            try {
                const token = localStorage.getItem('token')
                const [respuestaProf, resMaterias, resEstudiantes] = await Promise.all([
                    fetch('http://localhost:3000/api/profesores?page=1&limit=100', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    obtenerMaterias({ limite: 100 }),
                    obtenerEstudiantes({ limite: 1 })
                ])

                const resProfesores = await respuestaProf.json()
                const listaProfesores = resProfesores.profesores || []
                const totalProf = resProfesores.totalRegistros ?? listaProfesores.length
                const totalMat = resMaterias.totalRegistros || (resMaterias.datos ? resMaterias.datos.length : 0)
                const totalEst = resEstudiantes.totalRegistros || 0

                let sumaPrecios = 0
                const conteoModalidades = { Virtual: 0, Presencial: 0, Mixta: 0 }

                listaProfesores.forEach((prof) => {
                    sumaPrecios += Number(prof.precio_hora || 0)
                    if (prof.modalidad && conteoModalidades[prof.modalidad] !== undefined) {
                        conteoModalidades[prof.modalidad] += 1
                    }
                })

                const promedio = listaProfesores.length > 0 
                    ? Math.round(sumaPrecios / listaProfesores.length) 
                    : 0

                setEstadisticas({
                    totalProfesores: totalProf,
                    totalMaterias: totalMat,
                    totalEstudiantes: totalEst,
                    precioPromedio: promedio,
                    modalidades: conteoModalidades
                })
            } catch (err) {
                console.error(err)
                setError('No se pudieron cargar algunas estadísticas del sistema.')
            } finally {
                setCargando(false)
            }
        }

        cargarDatosDashboard()
    }, [])

    const calcularPorcentaje = (cantidad) => {
        if (estadisticas.totalProfesores === 0) return 0
        return Math.round((cantidad / estadisticas.totalProfesores) * 100)
    }

    return (
        <div className="page-container">
            <h2 className="page-title">
                Panel de <span className="highlight">Control</span>
            </h2>

            <p style={{ marginBottom: '32px', color: 'var(--color-text)' }}>
                Resumen general de métricas, estadísticas y accesos rápidos de Profy.
            </p>

            {error && (
                <p role="alert" style={{ color: 'var(--color-terracotta)', marginBottom: '20px' }}>
                    {error}
                </p>
            )}

            {cargando ? (
                <p>Cargando estadísticas...</p>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                        <div style={{ background: 'var(--color-background)', padding: '24px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
                            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-secondary)', textTransform: 'uppercase' }}>Profesores activos</span>
                            <p style={{ fontSize: '36px', fontWeight: '900', color: 'var(--color-primary)', margin: '8px 0 0' }}>{estadisticas.totalProfesores}</p>
                        </div>

                        <div style={{ background: 'var(--color-background)', padding: '24px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
                            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-secondary)', textTransform: 'uppercase' }}>Materias disponibles</span>
                            <p style={{ fontSize: '36px', fontWeight: '900', color: 'var(--color-primary)', margin: '8px 0 0' }}>{estadisticas.totalMaterias}</p>
                        </div>

                        <div style={{ background: 'var(--color-background)', padding: '24px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
                            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-secondary)', textTransform: 'uppercase' }}>Estudiantes registrados</span>
                            <p style={{ fontSize: '36px', fontWeight: '900', color: 'var(--color-primary)', margin: '8px 0 0' }}>{estadisticas.totalEstudiantes}</p>
                        </div>

                        <div style={{ background: 'var(--color-background)', padding: '24px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
                            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-secondary)', textTransform: 'uppercase' }}>Tarifa promedio / hora</span>
                            <p style={{ fontSize: '36px', fontWeight: '900', color: 'var(--color-primary)', margin: '8px 0 0' }}>${estadisticas.precioPromedio}</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        <div style={{ background: 'var(--color-background)', padding: '24px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)' }}>
                            <h3 style={{ margin: '0 0 20px', color: 'var(--color-primary)', fontSize: '18px' }}>Distribución por Modalidad</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {['Virtual', 'Presencial', 'Mixta'].map((mod) => {
                                    const cantidad = estadisticas.modalidades[mod] || 0
                                    const porcentaje = calcularPorcentaje(cantidad)

                                    return (
                                        <div key={mod}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' }}>
                                                <span>{mod}</span>
                                                <span style={{ color: 'var(--color-secondary)' }}>{cantidad} prof. ({porcentaje}%)</span>
                                            </div>
                                            <div style={{ width: '100%', height: '10px', background: '#e9ecef', borderRadius: '6px', overflow: 'hidden' }}>
                                                <div style={{ width: `${porcentaje}%`, height: '100%', background: 'var(--color-primary)', transition: 'width 0.4s ease' }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div style={{ background: 'var(--color-background)', padding: '24px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h3 style={{ margin: '0 0 8px', color: 'var(--color-primary)', fontSize: '18px' }}>Accesos Rápidos</h3>
                                <p style={{ margin: '0 0 20px', fontSize: '14px', color: 'var(--color-secondary)' }}>
                                    Ingresá directamente a los paneles de administración.
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button type="button" className="btn-secundario" onClick={() => onNavegar('Profesores')} style={{ width: '100%', textAlign: 'center' }}>
                                    Gestionar Profesores
                                </button>
                                <button type="button" className="btn-secundario" onClick={() => onNavegar('Materias')} style={{ width: '100%', textAlign: 'center' }}>
                                    Gestionar Materias
                                </button>
                                <button type="button" className="btn-secundario" onClick={() => onNavegar('Estudiantes')} style={{ width: '100%', textAlign: 'center' }}>
                                    Gestionar Estudiantes
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Dashboard