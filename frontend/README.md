# Profy - Frontend

Aplicación web desarrollada como Trabajo Final Integrador para la **Tecnicatura Universitaria en Programación (UTN)**.

Profy es una plataforma pensada para conectar estudiantes con profesores particulares. Desde la interfaz web se gestiona el registro e inicio de sesión de usuarios, la búsqueda y filtrado de profesores por materia o modalidad, la edición de perfiles y un panel de administración con exportación de listados a PDF para cada entidad.

---

## Enlaces del proyecto

- **Aplicación desplegada (Vercel):** https://proyecto-final-integrador-five.vercel.app/
- **API Backend (Render):** https://profy-backend.onrender.com
- **Repositorio:** https://github.com/reniturani/proyecto-final-integrador

---

## Tecnologías utilizadas

- **React 19** (`^19.3.1`)
- **Vite** (`^8.3.4`)
- **CSS3** (hojas de estilo modulares por vista y componente)
- **jsPDF** (`^4.2.1`) y **jsPDF-AutoTable** (`^5.0.9`) para generar y descargar listados en PDF
- **ESLint** (`^10.13.0`) para control de sintaxis y formato de código

---

## Estructura del proyecto

```text
frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/                     # Imágenes y recursos gráficos
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/                 # Componentes reutilizables de interfaz
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   ├── pages/                      # Vistas principales de la aplicación
│   │   ├── Aprender.jsx
│   │   ├── Bienvenida.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Estudiantes.jsx
│   │   ├── Login.jsx
│   │   ├── Materias.jsx
│   │   ├── Miperfil.jsx
│   │   ├── PerfilProfesor.jsx
│   │   ├── Profesores.jsx
│   │   ├── QuienesSomos.jsx
│   │   ├── RecuperarPassword.jsx
│   │   ├── RegistroEstudiante.jsx
│   │   ├── RegistroProfesor.jsx
│   │   └── RestablecerPassword.jsx
│   ├── services/                   # Capa de datos y gestión de entidades
│   │   ├── carrerasPorInstitucion.js
│   │   ├── estudiantes.js
│   │   ├── instituciones.js
│   │   ├── materias.js
│   │   └── profesores.js
│   ├── styles/                     # Estilos específicos por sección
│   │   ├── aprender.css
│   │   ├── materias.css
│   │   ├── perfiles.css
│   │   └── registros.css
│   ├── App.css                     # Estilos globales de layout
│   ├── App.jsx                     # Componente raíz y navegación entre vistas
│   ├── index.css                   # Reglas base y tipografía
│   └── main.jsx                    # Punto de entrada de React
├── .env.example                # Plantilla de variables de entorno
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

---

## Vistas y funcionalidades

La navegación entre pantallas se centraliza en `App.jsx` controlando la vista activa y los datos del perfil autenticado:

- **Sección pública:**
  - `Bienvenida`: presentación de la plataforma y accesos directos al registro de estudiantes o profesores e inicio de sesión.
  - `Quiénes somos`: pantalla informativa sobre nuestra plataforma.
  - `Aprender`: catálogo para que los estudiantes exploren profesores disponibles, filtrar por materia y modalidad, consultar su información y comunicarse vía Gmail con los profesores.
- **Autenticación y cuentas:**
  - `Login`: inicio de sesión diferenciando rol de estudiante, profesor o administrador.
  - `Registro Estudiante` y `Registro Profesor`: formularios de alta con validación de campos obligatorios para el registro.
  - `Recuperar contraseña`: flujo de solicitud de recuperación y actualización de contraseña.
- **Perfiles de usuario:**
  - `Mi perfil` (`Miperfil.jsx` / `PerfilProfesor.jsx`): vista condicional según el rol de la sesión (estudiante o profesor) para consultar y editar datos personales.
  - **Panel de administración (solo disponible para el administrador):**
  - `Dashboard`: vista principal con estadísticas de profesores, materias, alumnos y otras métricas generales de la plataforma, junto con accesos directos a cada panel de gestión.
  - `Profesores`: administración ABM (alta, baja y modificación) de profesores, con búsqueda, filtros, paginación y exportación del listado a PDF.
  - `Materias`: administración ABM (alta, baja y modificación) de materias, con búsqueda, ordenamiento, paginación y exportación del listado a PDF.
  - `Estudiantes`: administración ABM (alta, baja y modificación) de estudiantes, con búsqueda, paginación y exportación del listado a PDF.

---

## Requisitos previos

- **Node.js** (versión 18 o superior)
- **npm**

---

## Instalación y ejecución en local

1. **Clonar el repositorio.** En la terminal:
   ```bash
   git clone [https://github.com/reniturani/proyecto-final-integrador.git](https://github.com/reniturani/proyecto-final-integrador.git)
   ```

2. **Ingresar a la carpeta del frontend:**
   ```bash
   cd proyecto-final-integrador/frontend
   ```

3. **Instalar las dependencias:**
   ```bash
   npm install
   ```

4. **Configurar las variables de entorno:**
   Crear un archivo `.env` en la raíz de `frontend/` tomando como plantilla `.env.example` y definir la URL del backend:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

5. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación quedará disponible en `http://localhost:5173`.

---

## Scripts disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Levanta el entorno local de desarrollo con Vite. |
| `npm run build` | Compila y optimiza la aplicación para producción en la carpeta `dist/`. |
| `npm run preview` | Previsualiza localmente la build de producción generada. |
| `npm run lint` | Ejecuta ESLint para verificar errores o advertencias en el código. |

---

## Autoras

- **Renata Turani**
- **Alma Maitena Gomez Surop**