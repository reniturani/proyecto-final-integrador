import { useState } from 'react'
import Navbar from './components/Navbar'
import Bienvenida from './pages/Bienvenida.jsx' 
import Login from './pages/Login'
import Aprender from './pages/Aprender'
import MiPerfil from './pages/Miperfil'
import Profesores from './pages/Profesores'
import Materias from './pages/Materias'
import Estudiantes from './pages/Estudiantes'
import RegistroEstudiante from './pages/RegistroEstudiante'
import RegistroProfesor from './pages/RegistroProfesor'
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
        {paginaActual === 'Login' && <Login onNavegar={setPaginaActual} />}
        
        {paginaActual === 'Registro Profesor' && (<RegistroProfesor onNavegar={setPaginaActual} />)}        
        {paginaActual === 'Registro Estudiante' && (<RegistroEstudiante onNavegar={setPaginaActual} />)}       
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
