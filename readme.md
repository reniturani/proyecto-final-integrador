# Profy

Trabajo Final Integrador desarrollado para la **Tecnicatura Universitaria en Programación (UTN FRBB)**.

**Profy** es una plataforma web desarrollada para centralizar la oferta y demanda de clases particulares, vinculando estudiantes con profesores según sus necesidades académicas. A través de un sistema de autenticación y acceso diferenciado por roles, ofrece herramientas específicas para cada perfil:

- **Estudiantes:** registro de cuenta, exploración del catálogo docente con filtros por materia y modalidad, consulta de perfiles y contacto directo vía correo electrónico.
- **Profesores:** gestión de su perfil profesional, configuración de tarifas por hora, modalidad de dictado y materias asociadas.
- **Administradores:** panel de control con métricas generales de la plataforma, gestión completa (ABM) de profesores, materias y estudiantes, y exportación de listados en formato PDF.
---

## Enlaces del proyecto

- **Aplicación Web (Vercel):** https://proyecto-final-integrador-five.vercel.app/
- **API Backend (Render):** https://profy-backend.onrender.com
- **Repositorio:** https://github.com/reniturani/proyecto-final-integrador

---

## Estructura del repositorio

El proyecto está dividido en dos carpetas principales, cada una con su propia documentación técnica e instrucciones de ejecución:

- **[`frontend/`](./frontend/README.md):** interfaz de usuario desarrollada con React 19 y Vite. Incluye las vistas públicas, formularios de inicio de sesión y registro, edición de perfiles, catálogo de búsqueda y panel de administración con exportación a PDF.
- **[`backend/`](./backend/README.md):** API REST construida con Node.js, Express y Sequelize. Gestiona los modelos de datos, relaciones N:M, autenticación con JWT, encriptación con bcrypt, recuperación de contraseña y listados con paginación y filtros.

---

## Tecnologías principales

**Frontend**
- React 19 y Vite
- CSS3 modular
- jsPDF y jsPDF-AutoTable
- ESLint

**Backend**
- Node.js y Express
- Sequelize ORM (SQLite)
- JSON Web Tokens (JWT) y bcrypt

---

## Documentación detallada

Para consultar los requisitos previos, variables de entorno, endpoints y pasos para levantar el proyecto en local, ingresar a cada guía:

- [Documentación del Frontend](./frontend/README.md)
- [Documentación del Backend](./backend/README.md)

---

## Autoras

- **Renata Turani**
- **Alma Maitena Gomez Surop**