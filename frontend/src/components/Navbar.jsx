const opciones = [
    { nombre: 'Bienvenida', ruta: '/Bienvenida' },
    { nombre: 'Aprender', ruta: '/aprender' },
    { nombre: 'Mi perfil', ruta: '/mi-perfil' },
    { nombre: 'Profesores', ruta: '/profesores' },
    { nombre: 'Materias', ruta: '/materias' },
    { nombre: 'Estudiantes', ruta: '/estudiantes' },
]

function Navbar({ onNavegar, menuAbierto, setMenuAbierto }) {
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
            {opciones.map((opcion) => (
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