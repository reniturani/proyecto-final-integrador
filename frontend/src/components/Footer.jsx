function Footer({ onNavegar }) {
    // funcion para cambiar de página y volver arriba de todo automaticamente
    const irArribaYNavegar = (ruta) => {
        onNavegar(ruta);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Te lleva al techo de la página suavecito
    };

    // funcion para ir a "quienes somos" y bajar especificamente hasta "¿como funciona?"
    const irAComoFunciona = () => {
        onNavegar('Quiénes somos');
        
        setTimeout(() => {
        const seccion = document.getElementById('como-funciona');
        if (seccion) {
            seccion.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        }, 100);
    };

    return (
        <footer style={{ 
        background: 'var(--color-primary)', 
        color: 'var(--color-background)', 
        padding: '60px 40px 20px', 
        marginTop: '80px',
        width: '100%', 
        boxSizing: 'border-box', // Evita que el padding rompa el ancho
        fontFamily: 'system-ui, -apple-system, sans-serif' 
        }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            
            <div>
            <h3 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: 'bold', color: 'var(--color-background)' }}>Acerca de Profy</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li>
                <button onClick={() => irArribaYNavegar('Aprender')} style={{ background: 'none', border: 'none', color: '#d9e2cf', cursor: 'pointer', padding: 0, fontSize: '15px', textAlign: 'left' }}>Explorar clases</button>
                </li>
                <li>
                <button onClick={() => irArribaYNavegar('Quiénes somos')} style={{ background: 'none', border: 'none', color: '#d9e2cf', cursor: 'pointer', padding: 0, fontSize: '15px', textAlign: 'left' }}>¿Quiénes somos?</button>
                </li>
            </ul>
            </div>

            <div style={{ margin: '60px auto 0', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.15)', textAlign: 'left' }}>
            <p style={{ margin: 0, color: '#d9e2cf', fontSize: '14px' }}>
                © 2026 Profy, la mejor manera de aprender.
            </p>
            </div>

        </div>
        </footer>
    )
}

export default Footer