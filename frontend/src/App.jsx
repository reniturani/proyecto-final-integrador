import { useState } from 'react'
import Navbar from './components/Navbar'
import Bienvenida from './pages/Bienvenida.jsx'
import Login from './pages/Login'
import Aprender from './pages/Aprender'
import MiPerfil from './pages/Miperfil'
import Profesores from './pages/Profesores'
import Materias from './pages/Materias'
import Estudiantes from './pages/Estudiantes'
import './App.css'

function App() {
  const [paginaActual, setPaginaActual] = useState('Bienvenida')
  const [menuAbierto, setMenuAbierto] = useState(false)

  const [sesionActiva, setSesionActiva] = useState(
    Boolean(localStorage.getItem('token'))
  )

  const [rolUsuario, setRolUsuario] = useState(
    localStorage.getItem('usuarioRol') || ''
  )

  function navegar(pagina) {
    const paginasProtegidas = [
      'Aprender',
      'Materias',
      'Mi perfil',
      'Profesores',
      'Estudiantes'
    ]

    if (!sesionActiva && paginasProtegidas.includes(pagina)) {
      setPaginaActual('Login')
      return
    }

    setPaginaActual(pagina)
  }

  function iniciarSesion(rol) {
    setSesionActiva(true)
    setRolUsuario(rol)
  }

  return (
    <div className={menuAbierto ? 'app menu-abierto' : 'app'}>
      <Navbar
        onNavegar={navegar}
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
      />

      <div className="contenido-principal">
        {paginaActual === 'Bienvenida' && (
          <Bienvenida onNavegar={navegar} />
        )}

        {paginaActual === 'Login' && (
          <Login
            onNavegar={navegar}
            onLoginExitoso={iniciarSesion}
          />
        )}

        {paginaActual === 'Registro Profesor' && (
          <div>Componente de Registro Profesor (Mai)</div>
        )}

        {paginaActual === 'Registro Estudiante' && (
          <div>Componente de Registro Estudiante (Mai)</div>
        )}

        {sesionActiva && paginaActual === 'Aprender' && (
          <Aprender />
        )}

        {sesionActiva && paginaActual === 'Mi perfil' && (
          <MiPerfil />
        )}

        {sesionActiva && paginaActual === 'Profesores' && (
          <Profesores />
        )}

        {sesionActiva && paginaActual === 'Materias' && (
          <Materias />
        )}

        {sesionActiva && paginaActual === 'Estudiantes' && (
          <Estudiantes />
        )}
      </div>
    </div>
  )
}

export default App

