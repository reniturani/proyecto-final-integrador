// Catálogo inicial verificable para Profy (no contiene todas las universidades ni carreras de estas)
// Las ofertas cambian y algunas listas son parciales. No rechazar carreras ausentes.


const carrerasPorInstitucion = {
"Universidad de Buenos Aires": {
    sigla: "UBA",
    grado: ["Agronomía", "Arquitectura", "Abogacía", "Actuario", "Bioquímica", "Ciencias Biológicas", "Ciencias de la Computación", "Ciencias Geológicas", "Contador Público", "Diseño Gráfico", "Diseño Industrial", "Economía", "Farmacia", "Ingeniería Civil", "Ingeniería Electrónica", "Ingeniería Industrial", "Ingeniería Informática", "Ingeniería Química", "Medicina", "Odontología", "Psicología", "Veterinaria", "Licenciatura en Administración", "Licenciatura en Biotecnología", "Licenciatura en Ciencias Ambientales", "Licenciatura en Ciencias Antropológicas", "Licenciatura en Ciencias de la Educación", "Licenciatura en Ciencia Política", "Licenciatura en Ciencias de la Comunicación", "Licenciatura en Enfermería", "Licenciatura en Filosofía", "Licenciatura en Fonoaudiología", "Licenciatura en Geografía", "Licenciatura en Historia", "Licenciatura en Kinesiología y Fisiatría", "Licenciatura en Letras", "Licenciatura en Nutrición", "Licenciatura en Obstetricia", "Licenciatura en Sociología", "Licenciatura en Trabajo Social"],
    pregrado: ["Tecnicatura Universitaria en Producción Florihortícola", "Tecnicatura Universitaria en Jardinería", "Tecnicatura Universitaria en Producción Vegetal Orgánica", "Tecnicatura Universitaria en Turismo Rural", "Tecnicatura Universitaria en Acompañamiento de Trayectorias Educativas", "Tecnicatura Universitaria en Archivística", "Tecnicatura Universitaria en Bibliotecología", "Tecnicatura Universitaria en Podología", "Tecnicatura Universitaria en Hemoterapia e Inmunohematología", "Tecnicatura Universitaria en Instrumentación Quirúrgica", "Tecnicatura Universitaria en Anestesia", "Tecnicatura Universitaria en Prácticas Cardiológicas"],
    profesorados: ["Profesorado de Enseñanza Secundaria y Superior en Ciencias Ambientales", "Profesorado en Enseñanza Secundaria y Superior en Artes", "Profesorado de Enseñanza Secundaria y Superior en Ciencias Antropológicas", "Profesorado en Enseñanza Secundaria y Superior en Ciencias de la Educación", "Profesorado de Enseñanza Secundaria y Superior en Geografía", "Profesorado en Filosofía", "Profesorado en Historia"],
    ciclos: ["Licenciatura en Ciencia de la Información (Ciclo de Complementación Curricular)", "Licenciatura en Enfermería (Ciclo de Complementación Curricular)"],
    posgrado: [], diplomaturas: [],
    estado: "Listado base parcial de la guía DOE; no incluye la totalidad de carreras ni posgrados."
},



"Universidad Tecnológica Nacional": {
    sigla: "UTN",
    grado: ["Ingeniería Civil", "Ingeniería Eléctrica", "Ingeniería Electrónica", "Ingeniería Electromecánica", "Ingeniería en Sistemas de Información", "Ingeniería Industrial", "Ingeniería Mecánica", "Ingeniería Metalúrgica", "Ingeniería Naval", "Ingeniería Pesquera", "Ingeniería Química", "Ingeniería Textil", "Licenciatura en Organización Industrial", "Ingeniería en Energía"],
    pregrado: ["Tecnicatura Universitaria en Administración", "Tecnicatura Universitaria en Programación", "Tecnicatura Universitaria en Higiene y Seguridad en el Trabajo", "Tecnicatura Universitaria en Energías Sustentables", "Tecnicatura Universitaria Pesquera", "Tecnicatura Universitaria en Comercio Electrónico y Marketing Digital", "Tecnicatura Universitaria en Desarrollo y Producción de Videojuegos", "Tecnicatura Universitaria en Diseño Gráfico Digital", "Tecnicatura Universitaria en Gestión Aeronáutica", "Tecnicatura Universitaria en Gestión de Gobierno Electrónico", "Tecnicatura Universitaria en Logística", "Tecnicatura Universitaria en Negociación de Bienes"],
    profesorados: [],
    ciclos: ["Ciclo Complementario de Licenciatura en Higiene y Seguridad en el Trabajo", "Ciclo Complementario de Licenciatura en Administración"],
    posgrado: [],
    diplomaturas: [],
    estado: "Oferta variable según facultad regional; confirmar sede y modalidad."
},


"Universidad Nacional del Sur": {
    sigla: "UNS",
    grado: ["Abogacía", "Agrimensura", "Arquitectura", "Bioquímica", "Contador Público", "Farmacia", "Ingeniería Agronómica", "Ingeniería Civil", "Ingeniería Electricista", "Ingeniería Electrónica", "Ingeniería en Alimentos", "Ingeniería en Computación", "Ingeniería en Sistemas de Información", "Ingeniería en Telecomunicaciones", "Ingeniería Industrial", "Ingeniería Mecánica", "Ingeniería Química", "Licenciatura en Administración", "Licenciatura en Ciencias Ambientales", "Licenciatura en Ciencias Biológicas", "Licenciatura en Ciencias de la Computación", "Licenciatura en Ciencias de la Educación", "Licenciatura en Ciencias Geológicas", "Licenciatura en Economía", "Licenciatura en Enfermería", "Licenciatura en Filosofía", "Licenciatura en Física", "Licenciatura en Geofísica", "Licenciatura en Geografía", "Licenciatura en Gestión Universitaria", "Licenciatura en Historia", "Licenciatura en Letras", "Licenciatura en Matemática", "Licenciatura en Matemática Aplicada", "Licenciatura en Obstetricia", "Licenciatura en Oceanografía", "Licenciatura en Óptica y Contactología", "Licenciatura en Química", "Licenciatura en Seguridad Pública", "Licenciatura en Turismo", "Medicina"],
    pregrado: ["Tecnicatura Superior Agraria en Suelos y Aguas", "Tecnicatura Superior en Administración y Gestión de Recursos para Instituciones Universitarias", "Tecnicatura Universitaria Apícola", "Tecnicatura Universitaria en Acompañamiento Terapéutico", "Tecnicatura Universitaria en Cartografía, Teledetección y Sistemas de Información Geográfica", "Tecnicatura Universitaria en Deporte", "Tecnicatura Universitaria en Economía y Gestión de Empresas Alimentarias", "Tecnicatura Universitaria en Medio Ambiente", "Tecnicatura Universitaria en Oceanografía", "Tecnicatura Universitaria en Operaciones Industriales", "Tecnicatura Universitaria en Óptica", "Tecnicatura Universitaria en Parques y Jardines", "Tecnicatura Universitaria en Petróleo y Gas", "Tecnicatura Universitaria en Programación Web y Móvil", "Tecnicatura Universitaria en Sistemas Electrónicos Industriales Inteligentes"],
    profesorados: ["Profesorado de Educación Inicial", "Profesorado de Educación Primaria", "Profesorado en Ciencias Biológicas", "Profesorado en Economía", "Profesorado en Economía para la Enseñanza Secundaria", "Profesorado en Educación Secundaria en Ciencias de la Administración", "Profesorado en Educación Secundaria y Superior en Ciencias de la Administración", "Profesorado en Filosofía", "Profesorado en Física", "Profesorado en Geociencias", "Profesorado en Geografía", "Profesorado en Historia", "Profesorado en Letras", "Profesorado en Matemática", "Profesorado en Química", "Profesorado en Química de la Enseñanza Media", "Profesorado Universitario en Geografía"],
    ciclos: [],
    posgrado: [],
    diplomaturas: [],
    estado: "Oferta de grado y pregrado publicada para Bahía Blanca; posgrados no incluidos."


},
"Universidad Nacional de La Plata": {
    sigla: "UNLP",
    grado: ["Arquitectura", "Diseño Industrial", "Licenciatura en Diseño en Comunicación Visual", "Licenciatura en Artes Audiovisuales", "Licenciatura en Artes Plásticas", "Licenciatura en Diseño Multimedial", "Licenciatura en Historia de las Artes", "Licenciatura en Música", "Ingeniería Agronómica", "Ingeniería Forestal", "Licenciatura en Astronomía", "Geofísica", "Licenciatura en Meteorología y Ciencias de la Atmósfera", "Contador Público", "Licenciatura en Administración", "Licenciatura en Economía", "Licenciatura en Turismo", "Farmacia", "Licenciatura en Bioquímica", "Licenciatura en Ciencia y Tecnología de Alimentos", "Licenciatura en Química y Tecnología Ambiental", "Licenciatura en Biotecnología y Biología Molecular", "Licenciatura en Física", "Licenciatura en Física Médica", "Licenciatura en Matemática", "Licenciatura en Óptica Ocular y Optometría", "Licenciatura en Química", "Abogacía", "Escribanía", "Procurador", "Médico", "Licenciatura en Nutrición", "Licenciatura en Obstetricia", "Licenciatura en Antropología", "Licenciatura en Biología", "Licenciatura en Geoquímica", "Licenciatura en Geología", "Médico Veterinario", "Microbiólogo", "Licenciatura en Bibliotecología y Ciencia de la Información", "Licenciatura en Ciencias de la Educación", "Licenciatura en Educación Física", "Licenciatura en Filosofía", "Licenciatura en Historia", "Licenciatura en Letras", "Licenciatura en Sociología", "Licenciatura en Geografía", "Licenciatura en Informática", "Licenciatura en Sistemas", "Ingeniería en Computación", "Ingeniería Aeroespacial", "Ingeniería en Materiales", "Ingeniería Química", "Ingeniería Agrimensura", "Ingeniería Mecánica", "Ingeniería Hidráulica", "Ingeniería Electrónica", "Ingeniería Civil", "Ingeniería Industrial", "Ingeniería Electromecánica", "Ingeniería en Energía Eléctrica", "Ingeniería en Telecomunicaciones", "Odontología", "Licenciatura en Psicología", "Licenciatura en Trabajo Social", "Licenciatura en Fonoaudiología"],
    pregrado: ["Técnico Universitario en Producción Gráfica", "Técnico Universitario en Fotografía", "Técnico Universitario en Artes Audiovisuales", "Técnico Universitario en Sonido y Grabación", "Técnico Universitario en Cultivos Protegidos y Ambientes Controlados", "Técnico Universitario en Agroecología", "Técnico Universitario de Redes Geodésicas", "Técnico Universitario en Cálculo Científico", "Técnico Universitario en Procesamiento de Señales y Datos", "Técnico Universitario en Georreferenciación", "Técnico Universitario en Ciencias de la Tierra y el Ambiente", "Técnico en Meteorología", "Técnico en Cooperativas", "Técnico Universitario en Alimentos", "Técnico Químico Universitario", "Técnico Universitario en Gestión de Recursos para Instituciones Universitarias", "Técnico Superior Universitario de Martillero Público y Corredor", "Enfermero Universitario", "Técnico Universitario en Prácticas Cardiológicas", "Bibliotecólogo", "Técnico Universitario en Gimnasia, Juego y Deporte", "Técnico Universitario en Edición", "Técnico Universitario en Análisis Social", "Analista en Tecnologías de la Información y la Comunicación", "Analista Programador Universitario", "Técnico Universitario en Prótesis de Laboratorio Odontológico", "Técnico Superior Universitario en Comunicación Social", "Técnico Superior Universitario en Periodismo Deportivo", "Tecnicatura Universitaria en Comunicación Popular", "Tecnicatura en Comunicación Digital", "Tecnicatura Universitaria en Comunicación Pública y Política", "Técnico Universitario en Acompañamiento Terapéutico", "Técnico Universitario en Gastronomía"],
    profesorados: ["Profesor en Diseño Industrial", "Profesor en Diseño en Comunicación Visual", "Profesor en Artes Audiovisuales", "Profesor en Artes Plásticas", "Profesor de Música", "Profesor en Ciencias de la Educación", "Profesor de Educación Física", "Profesor de Matemática", "Profesor de Química", "Profesor de Física", "Profesor de Ciencias Biológicas", "Profesor de Filosofía", "Profesor en Historia", "Profesor en Letras", "Profesor de Sociología", "Profesor de Geografía", "Profesor en Lengua y Literatura Inglesas", "Profesor en Lengua y Literatura Francesas", "Profesor en Portugués", "Profesor en Comunicación Social", "Profesor en Psicología"],
    ciclos: ["Licenciatura en Gestión Penitenciaria (Ciclo de Complementación Curricular)", "Licenciatura en Educación Física (Ciclo de Licenciatura)", "Licenciatura en Fonoaudiología (Ciclo de Complementación Curricular)", "Licenciatura en Trabajo Social (Ciclo de Complementación Curricular)"],
    posgrado: [],
    diplomaturas: ["Diplomatura en Deportes Electrónicos"],
    estado: "Listado institucional de grado/pregrado; posgrados no incluidos."
},


"Universidad Nacional de Córdoba": {
    sigla: "UNC",
    grado: ["Abogacía", "Arquitectura", "Bioquímica", "Ciclo Notarial", "Ciencias Biológicas", "Ciencias Geológicas", "Constructor", "Contador Público", "Diseño Industrial", "Farmacia", "Ingeniería Aeroespacial", "Ingeniería en Agrimensura", "Ingeniería Ambiental", "Ingeniería Biomédica", "Ingeniería Civil", "Ingeniería Electromecánica", "Ingeniería Electrónica", "Ingeniería en Computación", "Ingeniería Industrial", "Ingeniería Mecánica", "Ingeniería Química", "Ingeniería Agronómica", "Licenciatura en Enfermería", "Licenciatura en Español, Lengua Materna y Lengua Extranjera", "Licenciatura en Filosofía", "Licenciatura en Física", "Licenciatura en Fonoaudiología", "Licenciatura en Geografía", "Licenciatura en Hidrometeorología", "Licenciatura en Historia", "Licenciatura en Kinesiología y Fisioterapia", "Licenciatura en Lengua y Literatura Alemanas", "Licenciatura en Lengua y Literatura Francesas", "Licenciatura en Lengua y Literatura Inglesas", "Licenciatura en Lengua y Literatura Italianas", "Licenciatura en Letras Clásicas", "Licenciatura en Letras Modernas", "Licenciatura en Matemática", "Licenciatura en Nutrición", "Licenciatura en Producción de Bioimágenes", "Licenciatura en Psicología"],
    pregrado: ["Martillero y Corredor Público", "Comunicador Visual", "Técnico Superior en Bromatología", "Técnico Superior Universitario en Comercialización", "Técnico Superior Universitario en Administración de Cooperativas y Mutuales", "Técnico Superior Universitario en Gestión Financiera", "Técnico Superior Universitario en Recursos Humanos", "Analista Universitario de Sistemas Informáticos", "Tecnicatura en Jardinería y Floricultura", "Tecnicatura Universitaria en Agroalimentos", "Técnico Mecánico Electricista", "Tecnicatura en Laboratorio Clínico e Histopatológico", "Bibliotecólogo", "Tecnicatura en Corrección Literaria"],
    profesorados: [],
    ciclos: ["Ciclo de Licenciatura en Ciencias de la Educación"],
    posgrado: [],
    diplomaturas: [],
    estado: "Listado parcial de grado y pregrado; la UNC informa 93 carreras de grado. Posgrados no incluidos."
},


"Universidad Argentina de la Empresa": {
    sigla: "UADE",
    grado: ["Licenciatura en Administración de Empresas", "Licenciatura en Administración de Empresas y Bachelor in Business", "Licenciatura en Gestión de Servicios de Salud", "Licenciatura en Gestión de Tecnología de la Información", "Licenciatura en Nutrición", "Licenciatura en Psicología", "Licenciatura en Tecnología de Datos con Orientación en Salud Digital"],
    pregrado: ["Martillero Público, Corredor y Administrador de Consorcios"],
    profesorados: [],
    ciclos: ["Licenciatura en Gestión de Servicios de Salud (Ciclo de Licenciatura)"],
    posgrado: [],
    diplomaturas: ["Diplomatura en Gestión de Servicios de Salud"],
    estado: "Oferta online publicada parcialmente; no representa el catálogo completo de carreras presenciales ni posgrados."
}
};

export const fuentesCarreras = {
UBA: "https://doe.uba.ar/carreras/",
UTN: "https://www.frch.utn.edu.ar/inscripcion/ ; https://www.frsc.utn.edu.ar/web/oferta-academica-3/",
UNS: "https://www.uns.edu.ar/secciones/academicas/carreras/oferta-academica_carreras-grado.php",
UNLP: "https://unlp.edu.ar/institucional/carreras-de-grado-y-pregrado-131438/",
UNC: "https://www.unc.edu.ar/acad%C3%A9micas/gu%C3%ADa-de-carreras-de-grado ; https://www.unc.edu.ar/pregrado",
UADE: "https://uade.edu.ar/carreras/ ; https://uade.edu.ar/sites/uade-online/modalidad-full-online/"
};

const normalizar = (texto = "") => texto.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export const obtenerCarrerasPorInstitucion = (nombreInstitucion) => {
if (!nombreInstitucion) return null;
const clave = Object.keys(carrerasPorInstitucion).find((nombre) =>
    normalizar(nombre) === normalizar(nombreInstitucion) ||
    normalizar(carrerasPorInstitucion[nombre].sigla) === normalizar(nombreInstitucion)
);
return clave ? carrerasPorInstitucion[clave] : null;
};

export const obtenerTodasLasCarreras = (nombreInstitucion) => {
    const datos = obtenerCarrerasPorInstitucion(nombreInstitucion);
    if (!datos) return [];

    return [
        ...datos.grado,
        ...datos.pregrado,
        ...datos.profesorados, 
        ...datos.ciclos, 
        ...datos.posgrado, 
        ...datos.diplomaturas];
};

export const obtenerInstitucionesPorCarrera = (carreraBuscada) => {
    if (!carreraBuscada?.trim()) return []

    const busqueda = normalizar(carreraBuscada)

    return Object.entries(carrerasPorInstitucion)
        .filter(([oferta]) => {
            const todasLasCarreras = [
                ...(oferta.grado || []),
                ...(oferta.pregrado || []),
                ...(oferta.profesorados || []),
                ...(oferta.ciclos || []),
                ...(oferta.posgrado || []),
                ...(oferta.diplomaturas || [])
            ]

            return todasLasCarreras.some(carrera =>
                normalizar(carrera).includes(busqueda)
            )
        })
        .map(([nombre]) => ({ nombre }))
}
export default carrerasPorInstitucion;