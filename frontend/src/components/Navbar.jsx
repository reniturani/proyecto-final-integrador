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
    return (
    <header className="navbar">
        <button
        type="button"
        className="navbar-menu-button"
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-expanded={menuAbierto}
        >
        {menuAbierto ? '✕' : '☰'}
        </button>
        
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
    </header>
    )
}

export default Navbar