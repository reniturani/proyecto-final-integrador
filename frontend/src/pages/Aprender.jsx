
import { useEffect, useState } from 'react'
import '../App.css'

function Aprender() {
    const [materias, setMaterias] = useState([])
    const [materiaSeleccionada, setMateriaSeleccionada] = useState('')
    const [error, setError] = useState('')
    
    useEffect(() => {
    async function cargarMaterias() {
        try {
        const respuesta = await fetch(
            'http://localhost:3000/api/materias?limite=100'
        )

        if (!respuesta.ok) {
            throw new Error('No se pudieron cargar las materias')
        }

        const datos = await respuesta.json()
        setMaterias(datos.datos)
    } catch (error) {
        console.error('Error al cargar materias:', error)
        setError('No se pudieron cargar las materias.')
    }
    }

    cargarMaterias()
}, [])

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
            
            <select id="modalidad" defaultValue="">
            <option value="">Elegí una modalidad</option>
            <option value="virtual">Virtual</option>
            <option value="presencial">Presencial</option>
            </select>
        </div>

        <button type="button" className="aprender-boton">
            Buscar profesores
        </button>
        </section>
        
        <section className="aprender-resultados">
        <h2>Profesores para vos</h2>

        {error ? (
            <p>{error}</p>
        ) : (
        <p>
            Elegí una materia y una modalidad para encontrar profesores.
            </p>
        )}
        </section>
    </main>
    )
}

export default Aprender
