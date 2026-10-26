function Bienvenida({ onNavegar }) {
    return (
        <div className="page-container pantalla-centrada">
            <h1 className="page-title">
                Conectamos <span className="highlight">talento</span> y ganas de aprender
            </h1>
            <p style={{ fontSize: '18px', maxWidth: '600px', lineHeight: '1.6', marginBottom: '32px' }}>
                Nuestra plataforma te permite encontrar al profesor ideal para tus materias o convertirte en uno para compartir tus conocimientos. ¿Qué te gustaría hacer hoy?
            </p>

            <div className="botones-bienvenida">
                <button 
                    className="btn-primario" 
                    onClick={() => onNavegar('Registro Profesor')}
                >
                    Quiero enseñar
                </button>
        
                <button 
                    className="btn-primario" 
                    onClick={() => onNavegar('Registro Estudiante')}
                >
                    Quiero aprender
                </button>
        
                <button 
                    className="btn-secundario" 
                    onClick={() => onNavegar('Login')}
                >
                    Ya tengo cuenta (Iniciar sesión)
            </button>
        </div>
    </div>
    )
}

export default Bienvenida