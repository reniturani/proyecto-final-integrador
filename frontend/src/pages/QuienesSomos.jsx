function QuienesSomos() {
    return (
        <div className="page-container" style={{ paddingBottom: '60px' }}>
        
        {/* titulo principal */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        <h2 className="page-title" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            Aprender empieza con encontrar a la <span className="highlight">persona indicada.</span>
        </h2>
        </div>

        {/* introduccion */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ fontSize: '22px', color: 'var(--color-text)', maxWidth: '900px', margin: '0 auto', lineHeight: '1.6' }}>
            Somos <strong>Profy</strong>, una plataforma que conecta a estudiantes con profesores particulares para hacer que encontrar apoyo académico sea más fácil, rápido y accesible.
            </p>
        </div>

        {/* desarrollo */}
        <div style={{ background: '#fffdf8', border: '1px solid #e7e6dc', borderRadius: '18px', padding: '40px 48px', marginBottom: '60px', boxShadow: '0 8px 30px rgba(30, 55, 0, 0.04)' }}>
            <p style={{ fontSize: '18px', color: '#526044', lineHeight: '1.7', margin: '0 0 20px' }}>
            Creemos que cada persona aprende de una manera diferente y que encontrar al profesor adecuado puede marcar una gran diferencia en ese camino. Por eso, creamos un espacio donde los estudiantes pueden descubrir distintas opciones, conocer a cada profesor y elegir la que mejor se adapte a sus necesidades.
            </p>
            <p style={{ fontSize: '18px', color: '#526044', lineHeight: '1.7', margin: 0 }}>
            Queremos simplificar la búsqueda de clases particulares, reuniendo en un mismo lugar la información necesaria para tomar una decisión con mayor seguridad.
            </p>
        </div>

        {/* mision y vision */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '60px' }}>
            <div style={{ flex: '1', minWidth: '300px', background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '18px', padding: '40px' }}>
            {/* Detalle visual minimalista en lugar de emoji */}
            <div style={{ width: '48px', height: '6px', background: 'var(--color-primary)', borderRadius: '4px', marginBottom: '24px' }}></div>
            <h4 style={{ margin: '0 0 16px', fontSize: '26px', color: 'var(--color-primary)' }}>Nuestra misión</h4>
            <p style={{ margin: 0, color: 'var(--color-text)', lineHeight: '1.6', fontSize: '18px' }}>
                Facilitar el encuentro entre estudiantes y profesores particulares, ofreciendo una plataforma intuitiva y accesible que permita encontrar oportunidades de aprendizaje de manera sencilla, transparente y flexible.
            </p>
            </div>

            <div style={{ flex: '1', minWidth: '300px', background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '18px', padding: '40px' }}>
            <div style={{ width: '48px', height: '6px', background: 'var(--color-primary)', borderRadius: '4px', marginBottom: '24px' }}></div>
            <h4 style={{ margin: '0 0 16px', fontSize: '26px', color: 'var(--color-primary)' }}>Nuestra visión</h4>
            <p style={{ margin: 0, color: 'var(--color-text)', lineHeight: '1.6', fontSize: '18px' }}>
                Ser una plataforma de referencia para la búsqueda de profesores particulares, creando un espacio donde enseñar y aprender estén cada vez más cerca, sin importar la materia o la modalidad de enseñanza.
            </p>
            </div>
        </div>

        {/* como funciona*/}
        <div style={{ marginBottom: '60px' }}>
            <h4 style={{ textAlign: 'center', fontSize: '32px', color: 'var(--color-primary)', margin: '0 0 50px' }}>¿Cómo funciona Profy?</h4>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            
            <div style={{ flex: '1', minWidth: '250px', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--color-mint)', color: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', margin: '0 auto 20px' }}>1</div>
                <h5 style={{ margin: '0 0 12px', fontSize: '22px', color: 'var(--color-primary)' }}>Buscá</h5>
                <p style={{ color: 'var(--color-text)', fontSize: '17px', lineHeight: '1.5' }}>Elegí la materia que necesitás aprender o reforzar.</p>
            </div>

            <div style={{ flex: '1', minWidth: '250px', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--color-mint)', color: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', margin: '0 auto 20px' }}>2</div>
                <h5 style={{ margin: '0 0 12px', fontSize: '22px', color: 'var(--color-primary)' }}>Explorá</h5>
                <p style={{ color: 'var(--color-text)', fontSize: '17px', lineHeight: '1.5' }}>Descubrí profesores, conocé sus perfiles, precios y modalidades.</p>
            </div>

            <div style={{ flex: '1', minWidth: '250px', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--color-mint)', color: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', margin: '0 auto 20px' }}>3</div>
                <h5 style={{ margin: '0 0 12px', fontSize: '22px', color: 'var(--color-primary)' }}>Contactá</h5>
                <p style={{ color: 'var(--color-text)', fontSize: '17px', lineHeight: '1.5' }}>Encontrá al profesor que mejor se adapte a vos y comunicate directamente.</p>
            </div>

            </div>
        </div>

        {/* cierre */}
        <div style={{ textAlign: 'center', padding: '50px 40px', background: 'var(--color-mint)', borderRadius: '18px', border: '1px solid var(--color-primary)' }}>
            <h4 style={{ margin: '0 0 16px', fontSize: '28px', color: 'var(--color-primary)' }}>Aprender y enseñar, más cerca.</h4>
            <p style={{ margin: 0, color: 'var(--color-primary)', fontSize: '19px', maxWidth: '700px', marginInline: 'auto', lineHeight: '1.6' }}>
            En Profy creemos que siempre hay algo nuevo por aprender y alguien dispuesto a enseñarlo. Nuestro objetivo es hacer que ese encuentro sea mucho más sencillo.
            </p>
        </div>

        </div>
    )
}
export default QuienesSomos