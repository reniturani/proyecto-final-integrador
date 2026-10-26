function Login() {
    return (
        <div className="page-container pantalla-centrada">
            <h1 className="page-title">Iniciar <span className="highlight">sesión</span></h1>
        
            <form className="formulario" onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                    <label>Email</label>
                    <input type="email" placeholder="tu@email.com" required />
                </div>
            
                <div className="input-group">
                    <label>Contraseña</label>
                    <input type="password" placeholder="••••••••" required />
                </div>
            
                <button type="submit" className="btn-primario" style={{ marginTop: '16px' }}>
                    Ingresar
                </button>
            </form>
        </div>
    )
}

export default Login