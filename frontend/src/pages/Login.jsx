    import { useState } from 'react'

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

        try {
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
            onNavegar('Profesores')
        } else {
            onNavegar('Inicio')
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

            <button type="submit" className="btn-primario" disabled={cargando} style={{ marginTop: '16px' }}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>
        </form>
        </div>
    )
    }
    export default Login