import { useState } from 'react'
import Navbar from './components/Navbar'
import Bienvenida from './pages/Bienvenida' 
import Login from './pages/Login'
import Inicio from './pages/Inicio'
import Aprender from './pages/Aprender'
import MiPerfil from './pages/Miperfil'
import Profesores from './pages/Profesores'
import Materias from './pages/Materias'
import Estudiantes from './pages/Estudiantes'
import './App.css'

function App() {
  const [paginaActual, setPaginaActual] = useState('Bienvenida')
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div className={menuAbierto ? 'app menu-abierto' : 'app'}>
      <Navbar
        onNavegar={setPaginaActual}
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
      />

      <div className="contenido-principal">
        {paginaActual === 'Bienvenida' && <Bienvenida onNavegar={setPaginaActual} />}
        {paginaActual === 'Login' && <Login />}
        
        {/* estas dos rutas las va a crear mai despues pero ya las dejo preparadas  */}
        {paginaActual === 'Registro Profesor' && <div>Componente de Registro Profesor (Mai)</div>}
        {paginaActual === 'Registro Estudiante' && <div>Componente de Registro Estudiante (Mai)</div>}

        {paginaActual === 'Inicio' && <Inicio />}
        {paginaActual === 'Aprender' && <Aprender />}
        {paginaActual === 'Mi perfil' && <MiPerfil />}
        {paginaActual === 'Profesores' && <Profesores />}
        {paginaActual === 'Materias' && <Materias />}
        {paginaActual === 'Estudiantes' && <Estudiantes />}
      </div>
    </div>
  )
}

export default App
