import { useState } from 'react'
import Navbar from './components/Navbar'
import Aprender from './pages/Aprender'
import './App.css'

function App() {
  const [paginaActual, setPaginaActual] = useState('')
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div className={menuAbierto ? 'app menu-abierto' : 'app'}>
      <Navbar
        onNavegar={setPaginaActual}
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
      />

      <div className="contenido-principal">
        {paginaActual === 'Aprender' && <Aprender />}
      </div>
    </div>
  )
}

export default App