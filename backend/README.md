# Profy - Backend

API REST desarrollada como Trabajo Final Integrador para la **Tecnicatura Universitaria en Programación (UTN)**.

Profy es una plataforma pensada para conectar estudiantes con profesores particulares. El backend se encarga de recibir y procesar las solicitudes de la aplicación, gestionar la información de estudiantes, profesores y materias, administrar la autenticación y almacenar los datos mediante una base de datos SQLite.

La API permite realizar operaciones de alta, baja, modificación y consulta de las entidades principales. También incorpora autenticación mediante JSON Web Tokens (JWT), control de acceso según el rol del usuario y funcionalidades para solicitar y restablecer contraseñas.

---

## Enlaces del proyecto

- **Aplicación desplegada (Vercel):** https://proyecto-final-integrador-five.vercel.app/
- **API Backend (Render):** https://profy-backend.onrender.com
- **Repositorio:** https://github.com/reniturani/proyecto-final-integrador

---

## Tecnologías utilizadas

- **Node.js:** entorno de ejecución de JavaScript.
- **Express** (`^5.2.1`): framework para desarrollar el servidor y gestionar las rutas de la API.
- **Sequelize** (`^6.37.8`): ORM utilizado para definir modelos y realizar operaciones sobre la base de datos.
- **SQLite3** (`^6.0.1`): sistema de base de datos utilizado para almacenar la información.
- **bcrypt** (`^6.0.0`): biblioteca para generar y verificar hashes de contraseñas.
- **jsonwebtoken** (`^9.0.3`): generación y validación de tokens JWT.
- **CORS** (`^2.8.6`): habilita solicitudes desde el frontend.
- **dotenv** (`^18.0.6`): carga variables de entorno desde el archivo `.env`.
- **Nodemon** (`^3.1.14`): reinicio automático del servidor durante el desarrollo.
- **ESLint** (`^10.12.0`): control de sintaxis y calidad del código.

---

## Estructura del proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js             # Configuración de SQLite y Sequelize
│   │
│   ├── controllers/                # Lógica de las operaciones de la API
│   │   ├── auth.controller.js
│   │   ├── estudiantes.controller.js
│   │   ├── materias.controller.js
│   │   ├── passwordReset.controller.js
│   │   ├── profesorMateria.controller.js
│   │   └── profesores.controller.js
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js      # Verificación de JWT y permisos
│   │
│   ├── models/                     # Modelos de datos
│   │   ├── estudiantes.js
│   │   ├── index.js
│   │   ├── materias.js
│   │   ├── passwordReset.js
│   │   ├── profesorMateria.js
│   │   └── profesores.js
│   │
│   ├── routes/                     # Definición de endpoints
│   │   ├── auth.routes.js
│   │   ├── estudiante.routes.js
│   │   ├── materias.routes.js
│   │   ├── passwordReset.routes.js
│   │   ├── profesor.routes.js
│   │   └── profesorMateria.routes.js
│   │
│   └── app.js                      # Configuración e inicio del servidor
│
├── .env                            # Configuración local (no se sube a GitHub)
├── .env.example                    # Plantilla de variables de entorno
├── package.json
└── package-lock.json
```

---

## Funcionalidades principales

- **Gestión de estudiantes:** registro, consulta por identificador, listado con búsqueda y paginación, actualización y eliminación.
- **Gestión de profesores:** registro, consulta por identificador, listado con búsqueda por nombre, filtrado por materia y modalidad, paginación, actualización y eliminación.
- **Gestión de materias:** consulta, creación, modificación y eliminación de materias.
- **Relación profesores-materias:** consulta de materias asociadas a un profesor, asignación y eliminación de asociaciones.
- **Autenticación:** inicio de sesión para estudiantes, profesores y administradores mediante JWT.
- **Control de acceso:** protección de operaciones mediante middleware de autenticación y verificación del rol administrador.
- **Recuperación de contraseñas:** generación y validación de tokens temporales y actualización de la contraseña del usuario.
- **Persistencia de datos:** almacenamiento local mediante SQLite y Sequelize.

### Base de datos

Se utiliza SQLite como sistema de almacenamiento y Sequelize para definir los modelos, realizar consultas y administrar las relaciones.

El backend cuenta con los siguientes modelos:

- `Estudiante`
- `Profesor`
- `Materia`
- `ProfesorMateria`
- `PasswordReset`

La relación entre profesores y materias es de muchos a muchos (N:M), implementada mediante la tabla intermedia `profesor_materia`.

Al iniciar el servidor, Sequelize autentica la conexión y ejecuta `sequelize.sync()` para sincronizar los modelos con la base de datos. El archivo `database.sqlite` se genera localmente al ejecutar el backend y está excluido del repositorio mediante `.gitignore`.

### Recuperación de contraseñas

El backend permite solicitar una recuperación y generar un token aleatorio. Para almacenarlo, se guarda su hash junto con una fecha de expiración de 15 minutos. Al restablecer la contraseña, se valida el token y se actualiza la contraseña utilizando bcrypt.

**Estado actual:** el envío automático del token por correo electrónico todavía no está implementado. Durante el desarrollo, el endpoint devuelve el token en la respuesta para poder probar el flujo; en producción no lo devuelve. La dependencia Nodemailer figura en el proyecto, pero el envío de correos no está integrado en el controlador actual.

---

## Rutas de la API

La API utiliza el prefijo `/api` para sus endpoints.

| Recurso | Método | Endpoint | Acceso |
| --- | --- | --- | --- |
| Estudiantes | GET | `/api/estudiantes` | Público |
| Estudiantes | GET | `/api/estudiantes/:id` | Público |
| Estudiantes | POST | `/api/estudiantes` | Público |
| Estudiantes | PUT | `/api/estudiantes/:id` | Administrador |
| Estudiantes | DELETE | `/api/estudiantes/:id` | Administrador |
| Profesores | GET | `/api/profesores` | Público |
| Profesores | GET | `/api/profesores/:id` | Público |
| Profesores | POST | `/api/profesores` | Público |
| Profesores | PUT | `/api/profesores/:id` | Administrador |
| Profesores | DELETE | `/api/profesores/:id` | Administrador |
| Materias | GET | `/api/materias` | Público |
| Materias | GET | `/api/materias/:id` | Público |
| Materias | POST | `/api/materias` | Administrador |
| Materias | PUT | `/api/materias/:id` | Administrador |
| Materias | DELETE | `/api/materias/:id` | Administrador |
| Profesores-Materias | GET | `/api/profesores/:id/materias` | Público |
| Profesores-Materias | POST | `/api/profesores/:id/materias/:idMateria` | Requiere JWT |
| Profesores-Materias | DELETE | `/api/profesores/:id/materias/:idMateria` | Requiere JWT |
| Autenticación | POST | `/api/auth/login` | Público |
| Recuperación | POST | `/api/auth/forgot-password` | Público |
| Recuperación | POST | `/api/auth/reset-password` | Público |

Las rutas protegidas requieren enviar un token JWT mediante el encabezado. Las operaciones marcadas como **Administrador** verifican tanto la validez del token como el rol del usuario. Las operaciones marcadas como **Requiere JWT** solamente exigen un token válido.

```
Authorization: Bearer TOKEN
```

El inicio de sesión recibe el email, la contraseña y el tipo de usuario (`estudiante`, `profesor` o `administrador`). Los tokens generados tienen una duración de una hora.

---

## Requisitos previos

- **Node.js**
- **npm**
- **Git** para clonar el repositorio.

---

## Instalación y ejecución en local

1. **Clonar el repositorio.** En la terminal:
    
    ```bash
    git clone https://github.com/reniturani/proyecto-final-integrador.git
    ```
    
2. **Ingresar a la carpeta del backend:**
    
    ```bash
    cd proyecto-final-integrador/backend
    ```
    
3. **Instalar las dependencias:**
    
    ```bash
    npm install
    ```
    
4. **Configurar las variables de entorno:**
    
    Crear un archivo `.env` dentro de `backend/`, tomando como referencia `.env.example`.
    
    Las variables necesarias son:
    
    ```
    JWT_SECRET=una_clave_larga_y_aleatoria
    
    # Credenciales del administrador
    ADMIN_EMAIL=admin@tusistema.com
    ADMIN_PASSWORD=reemplazar_por_una_clave_segura
    ```
    
    - `JWT_SECRET`: clave utilizada para firmar y verificar los tokens JWT.
    - `ADMIN_EMAIL`: email configurado para el inicio de sesión del administrador.
    - `ADMIN_PASSWORD`: contraseña configurada para el inicio de sesión del administrador.
    
    **Importante:** el archivo `.env` contiene valores locales y privados, por lo que debe permanecer excluido de Git mediante `.gitignore`. El archivo `.env.example` funciona como plantilla y se incluye en el repositorio.
    
5. **Iniciar el servidor en modo desarrollo:**
    
    ```bash
    npm run dev
    ```
    
    También se puede iniciar con:
    
    ```bash
    npm start
    ```
    
    El servidor queda disponible localmente en:
    
    `http://localhost:3000`
    
    El servidor utiliza el puerto definido en la variable de entorno `PORT`, o el puerto `3000` si no se especifica otro.
    
6. **Verificar el funcionamiento:**
    
    Abrir en el navegador:
    
    `http://localhost:3000/`
    
    La API responde:
    
    ```
    Backend funcionando
    ```
    
    Al iniciar correctamente, la consola informa la conexión con la base de datos y la sincronización de las tablas.
    

---

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor en modo desarrollo utilizando Nodemon. |
| `npm start` | Inicia el servidor utilizando Node.js. |

-----------------------------------------------------------------------------------

## Recuperación y restablecimiento de contraseñas para cuentas de demostración

### 1. Descripción general

Profy cuenta con un mecanismo de recuperación y restablecimiento de contraseñas para los usuarios del sistema.

Actualmente, las cuentas de estudiante y profesor utilizadas para las demostraciones funcionan mediante datos mock definidos en el frontend. Por este motivo, no se encuentran registradas en la base de datos ni utilizan el servicio de autenticación del backend.

Para permitir que estos usuarios puedan probar el proceso de recuperación sin necesidad de conectar sus cuentas a Render, se implementó una solución local utilizando `localStorage`.

### 2. Cuentas de demostración

Se encuentran configuradas las siguientes cuentas:

| Tipo de usuario | Correo electrónico | Contraseña inicial |
| --- | --- | --- |
| Estudiante | estudiante.prueba@profy.com | Estudiante123! |
| Profesor | profesor.prueba@profy.com | Profesor123! |

Estas credenciales se encuentran definidas en el objeto `usuariosDemo` de `Login.jsx`.

### 3. Funcionamiento de la recuperación

El proceso se desarrolla de la siguiente manera:

1. El usuario ingresa su correo electrónico en la pantalla de recuperación de contraseña.
2. El sistema verifica si el correo corresponde a una de las cuentas de demostración.
3. Si encuentra una coincidencia, genera un token local de recuperación.
4. El token se almacena en `localStorage` junto con el correo, el tipo de usuario y su fecha de vencimiento.
5. El token se muestra en pantalla para que el usuario pueda continuar con el proceso.

No se realiza el envío de correos electrónicos, ya que se trata de una funcionalidad de demostración.

### 4. Vencimiento del token

Los tokens de recuperación de las cuentas mock tienen una validez de **15 minutos**.

Al intentar restablecer la contraseña, el sistema comprueba:

- Que exista un token de recuperación almacenado.
- Que el token ingresado coincida con el generado.
- Que no haya superado su fecha de vencimiento.

Si el token es incorrecto, ya fue utilizado o venció, el sistema impide continuar y solicita generar uno nuevo.

### 5. Restablecimiento de la contraseña

Cuando el usuario presenta un token válido:

1. Ingresa una nueva contraseña.
2. Confirma la nueva contraseña.
3. El sistema verifica que ambas coincidan y que tengan al menos 8 caracteres.
4. La nueva contraseña se guarda en `localStorage`, asociada al correo electrónico del usuario.
5. El token de recuperación se elimina para impedir que vuelva a utilizarse.
6. Se muestra un mensaje de confirmación y se redirige al usuario al inicio de sesión.

### 6. Persistencia de los datos

Como las cuentas de demostración no están conectadas a una base de datos, el cambio de contraseña no modifica el objeto original `usuariosDemo`.

En su lugar, se utiliza `localStorage` para guardar la nueva contraseña en el navegador desde el cual se realizó el procedimiento.

Durante el inicio de sesión, el sistema verifica si existe una contraseña actualizada:

- Si existe, utiliza la contraseña almacenada en `localStorage`.
- Si no existe, utiliza la contraseña original definida en `usuariosDemo`.

Esto permite que el cambio de contraseña se conserve aunque se recargue o cierre y vuelva a abrir la aplicación en el mismo navegador y dominio.

**Importante:** los cambios no se sincronizan entre dispositivos o navegadores. Cada usuario que accede desde otro navegador conserva las credenciales originales de la cuenta mock.

### 7. Diferencia con la recuperación del administrador

El administrador mantiene su mecanismo de autenticación y recuperación mediante el backend desplegado en Render.

Las cuentas de estudiante y profesor utilizan la recuperación local implementada en el frontend, mientras que las operaciones del administrador continúan utilizando los endpoints de autenticación del backend.

### 8. Alcance y limitaciones

Esta implementación fue desarrollada para permitir las pruebas y demostraciones del proyecto mientras las cuentas de estudiante y profesor utilizan datos mock.

No constituye un mecanismo de autenticación seguro para producción, ya que las contraseñas se almacenan en texto plano en el almacenamiento local del navegador y los datos de las cuentas están disponibles en el frontend.

Para una implementación definitiva, será necesario conectar estas cuentas a un sistema de autenticación y almacenamiento persistente en el backend, con contraseñas protegidas mediante hash y tokens de recuperación seguros.
