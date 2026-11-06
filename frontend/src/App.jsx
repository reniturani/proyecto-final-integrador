import { useState } from 'react'
import Navbar from './components/Navbar'
import Bienvenida from './pages/Bienvenida.jsx' 
import Login from './pages/Login'
import Aprender from './pages/Aprender'
import MiPerfil from './pages/Miperfil'
import Profesores from './pages/Profesores'
import Materias from './pages/Materias'
import Estudiantes from './pages/Estudiantes'
import RegistroEstudiante from './pages/RegistroEstudiante.jsx' 
import RegistroProfesor from './pages/RegistroProfesor.jsx'
import QuienesSomos from './pages/QuienesSomos'
import Footer from './components/Footer'
import RecuperarPassword from './pages/RecuperarPassword'
import RestablecerPassword from './pages/RestablecerPassword'

import './App.css'

function App() {
  const [paginaActual, setPaginaActual] = useState('Bienvenida')
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [tokenRecuperacion, setTokenRecuperacion] = useState('')

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
        {paginaActual === 'Quiénes somos' && <QuienesSomos />}
        
        {paginaActual === 'Registro Profesor' && (<RegistroProfesor onNavegar={setPaginaActual} />)}
        {paginaActual === 'Registro Estudiante' && (<RegistroEstudiante onNavegar={setPaginaActual} />)}
        {paginaActual === 'Recuperar contraseña' && (<RecuperarPassword onNavegar={setPaginaActual} setTokenRecuperacion={setTokenRecuperacion}/>)}       
        {paginaActual === 'Restablecer contraseña' && (<RestablecerPassword onNavegar={setPaginaActual} tokenRecuperacion={tokenRecuperacion}/>)}        {paginaActual === 'Aprender' && <Aprender />}
        {paginaActual === 'Mi perfil' && <MiPerfil />}
        {paginaActual === 'Profesores' && <Profesores />}
        {paginaActual === 'Materias' && <Materias />}
        {paginaActual === 'Estudiantes' && <Estudiantes />}
        <Footer onNavegar={setPaginaActual} />
      </div>
    </div>
  )
}

export default App