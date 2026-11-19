
const instituciones = [
    // UNIVERSIDADES NACIONALES / ESTATALES
    { nombre: 'Universidad de Buenos Aires', siglas: ['UBA'] },
    { nombre: 'Universidad Nacional Arturo Jauretche', siglas: ['UNAJ'] },
    { nombre: 'Universidad Nacional de Avellaneda', siglas: ['UNDAV'] },
    { nombre: 'Universidad Nacional de Catamarca', siglas: ['UNCA'] },
    { nombre: 'Universidad Nacional de Chilecito', siglas: ['UNDEC'] },
    { nombre: 'Universidad Nacional de Córdoba', siglas: ['UNC'] },
    { nombre: 'Universidad Nacional de Cuyo', siglas: ['UNCUYO'] },
    { nombre: 'Universidad Nacional de Entre Ríos', siglas: ['UNER'] },
    { nombre: 'Universidad Nacional de Ezeiza', siglas: ['UNE'] },
    { nombre: 'Universidad Nacional de Formosa', siglas: ['UNAF'] },
    { nombre: 'Universidad Nacional de General San Martín', siglas: ['UNSAM'] },
    { nombre: 'Universidad Nacional de General Sarmiento', siglas: ['UNGS'] },
    { nombre: 'Universidad Nacional de Hurlingham', siglas: ['UNAHUR'] },
    { nombre: 'Universidad Nacional de José Clemente Paz', siglas: ['UNPAZ'] },
    { nombre: 'Universidad Nacional de Jujuy', siglas: ['UNJU'] },
    { nombre: 'Universidad Nacional de La Matanza', siglas: ['UNLaM'] },
    { nombre: 'Universidad Nacional de La Pampa', siglas: ['UNLPam'] },
    { nombre: 'Universidad Nacional de la Patagonia Austral', siglas: ['UNPA'] },
    { nombre: 'Universidad Nacional de la Patagonia San Juan Bosco', siglas: ['UNPSJB'] },
    { nombre: 'Universidad Nacional de La Plata', siglas: ['UNLP'] },
    { nombre: 'Universidad Nacional de La Rioja', siglas: ['UNLaR'] },
    { nombre: 'Universidad Nacional de Lanús', siglas: ['UNLa'] },
    { nombre: 'Universidad Nacional de las Artes', siglas: ['UNA'] },
    { nombre: 'Universidad Nacional de Lomas de Zamora', siglas: ['UNLZ'] },
    { nombre: 'Universidad Nacional de los Comechingones', siglas: ['UNLC'] },
    { nombre: 'Universidad Nacional de Luján', siglas: ['UNLu'] },
    { nombre: 'Universidad Nacional de Mar del Plata', siglas: ['UNMDP'] },
    { nombre: 'Universidad Nacional de Misiones', siglas: ['UNaM'] },
    { nombre: 'Universidad Nacional de Moreno', siglas: ['UNM'] },
    { nombre: 'Universidad Nacional de Quilmes', siglas: ['UNQ'] },
    { nombre: 'Universidad Nacional de Rafaela', siglas: ['UNRaf'] },
    { nombre: 'Universidad Nacional de Río Cuarto', siglas: ['UNRC'] },
    { nombre: 'Universidad Nacional de Río Negro', siglas: ['UNRN'] },
    { nombre: 'Universidad Nacional de Río Tercero', siglas: ['UNRT'] },
    { nombre: 'Universidad Nacional de Rosario', siglas: ['UNR'] },
    { nombre: 'Universidad Nacional de Salta', siglas: ['UNSa'] },
    { nombre: 'Universidad Nacional de San Antonio de Areco', siglas: ['UNSAdA'] },
    { nombre: 'Universidad Nacional de San Juan', siglas: ['UNSJ'] },
    { nombre: 'Universidad Nacional de San Luis', siglas: ['UNSL'] },
    { nombre: 'Universidad Nacional de Santiago del Estero', siglas: ['UNSE'] },
    { nombre: 'Universidad Nacional de Tierra del Fuego', siglas: ['UNTDF'] },
    { nombre: 'Universidad Nacional de Tres de Febrero', siglas: ['UNTREF'] },
    { nombre: 'Universidad Nacional de Tucumán', siglas: ['UNT'] },
    { nombre: 'Universidad Nacional de Villa María', siglas: ['UNVM'] },
    { nombre: 'Universidad Nacional de Villa Mercedes', siglas: ['UNViMe'] },
    { nombre: 'Universidad Nacional del Alto Uruguay', siglas: ['UNAU'] },
    { nombre: 'Universidad Nacional del Centro de la Provincia de Buenos Aires', siglas: ['UNICEN'] },
    { nombre: 'Universidad Nacional del Chaco Austral', siglas: ['UNCAus'] },
    { nombre: 'Universidad Nacional del Comahue', siglas: ['UNCo'] },
    { nombre: 'Universidad Nacional del Delta', siglas: ['UNDelta'] },
    { nombre: 'Universidad Nacional del Litoral', siglas: ['UNL'] },
    { nombre: 'Universidad Nacional del Nordeste', siglas: ['UNNE'] },
    { nombre: 'Universidad Nacional del Noroeste de la Provincia de Buenos Aires', siglas: ['UNNOBA'] },
    { nombre: 'Universidad Nacional del Oeste', siglas: ['UNO'] },
    { nombre: 'Universidad Nacional del Sur', siglas: ['UNS'] },
    { nombre: 'Universidad Nacional Guillermo Brown', siglas: ['UNaB'] },
    { nombre: 'Universidad Nacional Madres de Plaza de Mayo', siglas: ['UNMa'] },
    { nombre: 'Universidad Nacional Pilar', siglas: ['UNPilar'] },
    { nombre: 'Universidad Nacional Raúl Scalabrini Ortiz', siglas: ['UNSO'] },
    { nombre: 'Universidad Pedagógica Nacional', siglas: ['UNIPE'] },
    { nombre: 'Universidad Tecnológica Nacional', siglas: ['UTN'] },
    { nombre: 'Universidad de la Defensa Nacional', siglas: ['UNDEF'] },

    // UNIVERSIDADES PRIVADAS
    { nombre: 'Escuela Universitaria de Teología', siglas: [] },
    { nombre: 'Instituto Tecnológico de Buenos Aires', siglas: ['ITBA'] },
    { nombre: 'Instituto Universitario CEMIC', siglas: ['IUC'] },
    { nombre: 'Instituto Universitario de Ciencias Biomédicas de Córdoba', siglas: [] },
    { nombre: 'Instituto Universitario de Ciencias de la Salud', siglas: [] },
    { nombre: 'Instituto Universitario del Gran Rosario', siglas: ['IUGR'] },
    { nombre: 'Instituto Universitario Italiano de Rosario', siglas: ['IUNIR'] },
    { nombre: 'Pontificia Universidad Católica Argentina', siglas: ['UCA'] },
    { nombre: 'Universidad Abierta Interamericana', siglas: ['UAI'] },
    { nombre: 'Universidad Adventista del Plata', siglas: ['UAP'] },
    { nombre: 'Universidad Argentina de la Empresa', siglas: ['UADE'] },
    { nombre: 'Universidad Argentina John F. Kennedy', siglas: ['UK'] },
    { nombre: 'Universidad Atlántida Argentina', siglas: ['UAA'] },
    { nombre: 'Universidad Austral', siglas: [] },
    { nombre: 'Universidad Blas Pascal', siglas: ['UBP'] },
    { nombre: 'Universidad CAECE', siglas: ['CAECE'] },
    { nombre: 'Universidad Católica de Córdoba', siglas: ['UCC'] },
    { nombre: 'Universidad Católica de Cuyo', siglas: ['UCCuyo'] },
    { nombre: 'Universidad Católica de La Plata', siglas: ['UCALP'] },
    { nombre: 'Universidad Católica de Salta', siglas: ['UCASAL'] },
    { nombre: 'Universidad Católica de Santa Fe', siglas: ['UCSF'] },
    { nombre: 'Universidad Católica de Santiago del Estero', siglas: ['UCSE'] },
    { nombre: 'Universidad Champagnat', siglas: ['UCH'] },
    { nombre: 'Universidad FASTA', siglas: ['UFASTA'] },
    { nombre: 'Universidad de Belgrano', siglas: ['UB'] },
    { nombre: 'Universidad de Ciencias Empresariales y Sociales', siglas: ['UCES'] },
    { nombre: 'Universidad de Concepción del Uruguay', siglas: ['UCU'] },
    { nombre: 'Universidad de Congreso', siglas: ['UC'] },
    { nombre: 'Universidad de Flores', siglas: ['UFLO'] },
    { nombre: 'Universidad de la Cuenca del Plata', siglas: ['UCP'] },
    { nombre: 'Universidad de la Marina Mercante', siglas: ['UdeMM'] },
    { nombre: 'Universidad de Mendoza', siglas: ['UM'] },
    { nombre: 'Universidad de Morón', siglas: ['UM'] },
    { nombre: 'Universidad de Palermo', siglas: ['UP'] },
    { nombre: 'Universidad de San Andrés', siglas: ['UdeSA'] },
    { nombre: 'Universidad del Aconcagua', siglas: ['UDA'] },
    { nombre: 'Universidad del CEMA', siglas: ['UCEMA'] },
    { nombre: 'Universidad del Centro Educativo Latinoamericano', siglas: ['UCEL'] },
    { nombre: 'Universidad del Cine', siglas: ['UCINE'] },
    { nombre: 'Universidad del Norte Santo Tomás de Aquino', siglas: ['UNSTA'] },
    { nombre: 'Universidad del Salvador', siglas: ['USAL'] },
    { nombre: 'Universidad Empresarial Siglo 21', siglas: ['UES21'] },
    { nombre: 'Universidad Escuela Argentina de Negocios', siglas: ['UEAN'] },
    { nombre: 'Universidad Favaloro', siglas: [] },
    { nombre: 'Universidad Gastón Dachary', siglas: ['UGD'] },
    { nombre: 'Universidad Hospital Italiano de Buenos Aires', siglas: [] },
    { nombre: 'Universidad ISALUD', siglas: ['ISALUD'] },
    { nombre: 'Universidad Juan Agustín Maza', siglas: ['UMaza'] },
    { nombre: 'Universidad Maimónides', siglas: ['UMAI'] },
    { nombre: 'Universidad Notarial Argentina', siglas: ['UNA'] },
    { nombre: 'Universidad San Pablo - Tucumán', siglas: ['USPT'] },
    { nombre: 'Universidad Torcuato Di Tella', siglas: ['UTDT'] },
    { nombre: 'Universidad del Museo Social Argentino', siglas: ['UMSA'] },

    // UNIVERSIDADES PROVINCIALES
    { nombre: 'Universidad Autónoma de Entre Ríos', siglas: ['UADER'] },
    { nombre: 'Universidad del Chubut', siglas: ['UDC'] },
    { nombre: 'Universidad Provincial de Córdoba', siglas: ['UPC'] },
    { nombre: 'Universidad Provincial de Laguna Blanca', siglas: ['UPLaB'] },
    { nombre: 'Universidad Provincial del Sudoeste', siglas: ['UPSO'] },

    // OTRAS INSTITUCIONES UNIVERSITARIAS RECONOCIDAS
    { nombre: 'Instituto Universitario de Gendarmería Nacional', siglas: ['IUGNA'] },
    { nombre: 'Instituto Universitario de la Policía Federal Argentina', siglas: ['IUPFA'] },
    { nombre: 'Instituto Universitario de Seguridad Marítima', siglas: ['IUSM'] },
    { nombre: 'Instituto Universitario Aeronáutico', siglas: ['IUA'] },
    { nombre: 'Instituto Universitario Ejército', siglas: ['IESE'] },
    { nombre: 'Instituto Universitario Naval', siglas: [] },
    { nombre: 'Instituto Universitario de Seguridad', siglas: [] },
    { nombre: 'Instituto Universitario Patagónico de las Artes', siglas: ['IUPA'] },
    { nombre: 'Universidad Católica de las Misiones', siglas: ['UCAMI'] },
    { nombre: 'Universidad de Innovación y Tecnología', siglas: [] },
    { nombre: 'Universidad de la Integración Sudamericana', siglas: ['UNISUD'] },
    { nombre: 'Universidad de San Isidro Dr. Plácido Marín', siglas: ['USI'] },
    { nombre: 'Universidad del Este', siglas: ['UDE'] },
    { nombre: 'Universidad del Sur de Buenos Aires', siglas: ['USBA'] },
    { nombre: 'Universidad Evangélica', siglas: [] },
    { nombre: 'Universidad Metropolitana para la Educación y el Trabajo', siglas: ['UMET'] },
    { nombre: 'Universidad Patagonia Argentina', siglas: ['UPA'] },
    { nombre: 'Universidad Salesiana', siglas: ['UNISAL'] },
    { nombre: 'Universidad de Bologna - Sede Argentina', siglas: ['UNIBO'] },
    { nombre: 'FLACSO - Facultad Latinoamericana de Ciencias Sociales', siglas: ['FLACSO'] }
]

export const obtenerInstituciones = (busqueda = '') => {
    const termino = busqueda
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()

    if (!termino) return []

    return instituciones
        .filter(institucion => {
            const nombre = institucion.nombre
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')

            const siglas = institucion.siglas.join(' ').toLowerCase()

            return nombre.includes(termino) || siglas.includes(termino)
        })
        .sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es', {
        sensitivity: 'base'
    })
)
}
