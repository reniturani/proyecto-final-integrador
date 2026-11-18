function Bienvenida({ onNavegar }) {
    return (
        <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            
            <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '70px 20px', background: 'var(--color-background)', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)', marginBottom: '50px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
                
                <span style={{ display: 'inline-block', padding: '8px 20px', borderRadius: '30px', background: 'rgba(36, 69, 0, 0.1)', color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '15px', marginBottom: '24px' }}>
                    Aprender, ahora más cerca
                </span>

                <h1 className="page-title" style={{ fontSize: '3.2rem', marginBottom: '24px', textAlign: 'center', lineHeight: '1.2' }}>
                    Conectamos <span className="highlight">talento</span> y ganas de aprender
                </h1>

                <p style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', maxWidth: '750px', margin: '0 auto 36px auto', lineHeight: '1.6', textAlign: 'center' }}>
                    Nuestra plataforma te permite encontrar al profesor ideal para tus materias o convertirte en uno para compartir tus conocimientos. ¿Qué te gustaría hacer hoy?
                </p>

                <div className="botones-bienvenida" style={{ display: 'flex', justifyContent: 'center', gap: '18px', flexWrap: 'wrap' }}>
                    <button 
                        className="btn-primario" 
                        onClick={() => onNavegar('Registro Profesor')}
                        style={{ padding: '14px 32px', fontSize: '1.15rem' }}
                    >
                        Quiero enseñar
                    </button>
            
                    <button 
                        className="btn-primario" 
                        onClick={() => onNavegar('Registro Estudiante')}
                        style={{ padding: '14px 32px', fontSize: '1.15rem' }}
                    >
                        Quiero aprender
                    </button>
            
                    <button 
                        className="btn-secundario" 
                        onClick={() => onNavegar('Login')}
                        style={{ padding: '14px 32px', fontSize: '1.15rem', background: 'white' }}
                    >
                        Ya tengo cuenta (Iniciar sesión)
                    </button>
                </div>
            </section>

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
                
                <div style={{ background: 'rgba(36, 69, 0, 0.04)', padding: '36px 32px', borderRadius: 'var(--radius-card)', border: '1px solid rgba(36, 69, 0, 0.2)', textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--color-primary)', marginBottom: '16px', fontSize: '1.35rem' }}>Encontrá tu profesor ideal</h3>
                    <p style={{ color: 'var(--color-secondary)', fontSize: '1.05rem', margin: 0, lineHeight: '1.6' }}>
                        Explorá distintas materias y descubrí profesores que puedan acompañarte en tu aprendizaje, según tus necesidades y objetivos.
                    </p>
                </div>

                <div style={{ background: 'rgba(36, 69, 0, 0.04)', padding: '36px 32px', borderRadius: 'var(--radius-card)', border: '1px solid rgba(36, 69, 0, 0.2)', textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--color-primary)', marginBottom: '16px', fontSize: '1.35rem' }}>Compartí lo que sabés</h3>
                    <p style={{ color: 'var(--color-secondary)', fontSize: '1.05rem', margin: 0, lineHeight: '1.6' }}>
                        Convertí tus conocimientos en oportunidades, mostrá lo que tenés para enseñar y conectá con estudiantes interesados en aprender.
                    </p>
                </div>

                <div style={{ background: 'rgba(36, 69, 0, 0.04)', padding: '36px 32px', borderRadius: 'var(--radius-card)', border: '1px solid rgba(36, 69, 0, 0.2)', textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--color-primary)', marginBottom: '16px', fontSize: '1.35rem' }}>Aprendé y enseñá a tu manera</h3>
                    <p style={{ color: 'var(--color-secondary)', fontSize: '1.05rem', margin: 0, lineHeight: '1.6' }}>
                        Elegí entre distintas materias, precios y modalidades. Encontrá una opción que se adapte a vos y contactá directamente con la otra persona.
                    </p>
                </div>

            </section>

        </div>
    )
}

export default Bienvenida