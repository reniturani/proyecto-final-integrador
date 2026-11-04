const opciones = [
    { nombre: 'Bienvenida', ruta: '/Bienvenida', requiereAdmin: false },
    { nombre: 'Aprender', ruta: '/aprender', requiereAdmin: false },
    { nombre: 'Mi perfil', ruta: '/mi-perfil', requiereAdmin: false },
    { nombre: 'Profesores', ruta: '/profesores', requiereAdmin: true },
    { nombre: 'Materias', ruta: '/materias', requiereAdmin: true },
    { nombre: 'Estudiantes', ruta: '/estudiantes', requiereAdmin: true },
]

function Navbar({ onNavegar, menuAbierto, setMenuAbierto }) {
    // 1. lee que rol tiene el usuario guardado en el navegador
    const rolUsuario = localStorage.getItem('usuarioRol')
    // 2. filtra las opciones segun el rol del usuario
    const opcionesVisibles = opciones.filter((opcion) => {
    if (opcion.requiereAdmin) {
      return rolUsuario === 'administrador' // solo pasa si es admin
    }
    return true // si no requiere admin, la ven todos
    })

    // funcion para cerrar sesion
    const manejarCerrarSesion = () => {
    // limpia los datos del usuario en el navegador
    localStorage.removeItem('token')
    localStorage.removeItem('usuarioRol')
    
    // cierra el menu si estaba abierto y lo manda a la bienvenida
    setMenuAbierto(false)
    onNavegar('Bienvenida')
    }

    return (
    <header className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 30px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
        type="button"
        className="navbar-menu-button"
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-expanded={menuAbierto}
        >
        {menuAbierto ? '✕' : '☰'}
        </button>

        <h1 
            onClick={() => {
                setMenuAbierto(false)
                onNavegar('Aprender')
            }}
            style={{ position: 'relative', zIndex: 12, margin: '0 0 0 60px', cursor: 'pointer', fontSize: '28px', fontWeight: '900', color: 'var(--color-primary)', letterSpacing: '-0.5px' }}
            >
            Profy.
        </h1>
    </div>
        </div>
        
        {menuAbierto && (
        <nav className="navbar-dropdown">
            {/* 3. Mapeamos solo las opciones que pasaron el filtro */}
            {opcionesVisibles.map((opcion) => (
            <a
            key={opcion.ruta}
            href="#"
            className="navbar-link"
            onClick={() => {
                setMenuAbierto(false)
                onNavegar(opcion.nombre)
            }}
            >
                {opcion.nombre}
            </a>
        ))}
        </nav>
    )}
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {rolUsuario ? (
          // si esta logeado muestra el badge y el botón de Salir
            <>
                <span style={{ background: '#e9ecef', color: '#495057', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize', border: '1px solid var(--color-border)' }}>
                {rolUsuario === 'administrador' ? 'Admin' : rolUsuario}
                </span>
                
                <button 
                onClick={manejarCerrarSesion}
                style={{ background: 'transparent', border: '1px solid var(--color-terracotta)', color: 'var(--color-terracotta)', padding: '6px 14px', borderRadius: 'var(--radius-button)', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                >
                Cerrar Sesión
                </button>
            </>
            ) : (
            // si no esta logeado directo para ingresar/registrarse
            <button 
                onClick={() => onNavegar('Bienvenida')}
                className="btn-primario"
                style={{ padding: '8px 20px', fontSize: '14px' }}
            >
                Ingresar a la plataforma
            </button>
            )}
        </div>

        </header>
    )
}

export default Navbar