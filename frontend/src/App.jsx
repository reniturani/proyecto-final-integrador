import { useState } from 'react'
import Navbar from './components/Navbar'
import Inicio from './pages/Inicio'
import Aprender from './pages/Aprender'
import MiPerfil from './pages/Miperfil'
import Profesores from './pages/Profesores'
import Materias from './pages/Materias'
import Estudiantes from './pages/Estudiantes'
import './App.css'

function App() {
  const [paginaActual, setPaginaActual] = useState('Inicio')
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div className={menuAbierto ? 'app menu-abierto' : 'app'}>
      <Navbar
        onNavegar={setPaginaActual}
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
      />

      <div className="contenido-principal">
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
