    import { useState } from 'react'

    const usuariosDemo = {
    estudiante: {
        email: 'estudiante.prueba@profy.com',
        password: 'Estudiante123!',
        perfil: {
            id_estudiante: 13,
            nombre: 'Estudiante',
            apellido: 'Prueba',
            email: 'estudiante.prueba@profy.com',
            rol: 'estudiante',
            materias: [1,9,10],
            modalidad: 'Virtual',
            formacion: '',
            presentacion: 'Soy estudiante y busco reforzar los temas clave de mis materias con explicaciones claras, prácticas y a mi ritmo. Me gusta trabajar sobre ejercicios reales, entender el porqué de cada concepto y resolver dudas puntuales para llegar con seguridad a los parciales y finales.'
        }
    },
    profesor: {
    email: 'profesor.prueba@profy.com',
    password: 'Profesor123!',
    perfil: {
        id_profesor: 13,
        nombre: 'Profesor',
        apellido: 'Prueba',
        email: 'profesor.prueba@profy.com',
        rol: 'profesor',
        presentacion: 'Soy profesor y me enfoco en acompañar a los estudiantes a construir bases sólidas y resolver ejercicios prácticos a su ritmo. Explico los conceptos de forma clara, paso a paso y conectándolos con ejemplos reales para ganar seguridad en clase y en los exámenes. Adapto cada encuentro según las dudas, el nivel y los objetivos de cada persona.',
        precio_hora: 10000,
        modalidad: 'Mixta',
        ubicacion: 'Bahía Blanca',
        materias: [1, 9, 10],

        formacion: {
            universitario: {
                seleccionado: true,
                titulo: 'Formación en Sistemas y Bases de Datos',
                institucion: 'Instituto Demo Profy (datos ficticios)'
            },
            terciario: {
                seleccionado: false,
                titulo: '',
                institucion: ''
            },
            cursos: {
                seleccionado: false,
                titulo: '',
                institucion: ''
            }
        },

        tieneExperiencia: true,
        detalleExperiencia: 'Experiencia de demostración: clases particulares de Bases de Datos, consultas SQL y modelado de datos. Acompañamiento a estudiantes mediante ejercicios prácticos.'
    }
}
}

    function Login({ onNavegar }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [tipo, setTipo] = useState('administrador')
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setCargando(true)

        try { // Inicio de sesión local para estudiantes y profesores
    if (tipo !== 'administrador') {
    const usuario = usuariosDemo[tipo]

    if (
        email.trim().toLowerCase() !== usuario.email ||
        password !== usuario.password
    ) {
        throw new Error('Email o contraseña incorrectos.')
    }

    localStorage.removeItem('token')
    localStorage.setItem('usuarioRol', tipo)
    localStorage.setItem(
        'usuarioId',
        String(
            tipo === 'estudiante'
                ? usuario.perfil.id_estudiante
                : usuario.perfil.id_profesor
        )
    )

    onNavegar('Mi perfil', usuario.perfil)
    return
}
        const respuesta = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            // envia los 3 datos que espera el controlador
            body: JSON.stringify({ email, password, tipo })
        })

        const datos = await respuesta.json()

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || 'Error al iniciar sesión')
        }

        // guarda el token para usarlo en las peticiones
        localStorage.setItem('token', datos.token)
        localStorage.setItem('usuarioRol', tipo)

        // si es administrador, lo llevamos a su panel. si no, al inicio
        if (tipo === 'administrador') {
            onNavegar('Dashboard')
        } else {
            onNavegar('Bienvenida')
        }
        } catch (err) {
        setError(err.message)
        } finally {
        setCargando(false)
        }
    }

    return (
        <div className="page-container pantalla-centrada">
        <h1 className="page-title">Iniciar <span className="highlight">sesión</span></h1>

        <form className="formulario" onSubmit={handleSubmit}>
            {error && (
            <div style={{ color: 'var(--color-terracotta)', background: '#ffe9e9', padding: '10px', borderRadius: '6px', fontSize: '14px' }}>
                {error}
            </div>
            )}

            <div className="input-group">
            <label>Tipo de usuario</label>
            <select 
                value={tipo} 
                onChange={(e) => setTipo(e.target.value)}
                style={{ padding: '12px', borderRadius: 'var(--radius-button)', border: '1px solid var(--color-border)', fontSize: '16px', background: 'var(--color-background)', color: 'var(--color-text)' }}
            >
                <option value="administrador">Administrador</option>
                <option value="profesor">Profesor</option>
                <option value="estudiante">Estudiante</option>
            </select>
            </div>

            <div className="input-group">
            <label>Email</label>
            <input 
                type="email" 
                placeholder="tu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
            />
            </div>

            <div className="input-group">
            <label>Contraseña</label>
            <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
            />
            </div>

            {/*enlace para recuperar la contraseña*/} 
            <div style={{ textAlign: 'right', marginTop: '10px' }}>
            <button
                type="button"
                className="registro-enlace"
                onClick={() => onNavegar('Recuperar contraseña')}
            >
            ¿Olvidaste tu contraseña? 
                </button>
            </div>

            <button type="submit" className="btn-primario" disabled={cargando} style={{ marginTop: '16px' }}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>
        </form>
        </div>
    )
    }
    export default Login