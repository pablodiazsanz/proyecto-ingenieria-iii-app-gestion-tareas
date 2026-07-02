# Task Manager Secure

Aplicación web sencilla para la asignatura **Proyecto de Ingeniería III**. Incluye:

- Frontend en Angular
- Aplicación móvil en Ionic + Angular
- Backend en Spring Boot
- Base de datos PostgreSQL
- Autenticación JWT
- Despliegue con Docker Compose

## Estructura

```text
task-manager-secure/
├── backend/
├── frontend/
├── mobile/
├── docker-compose.yml
└── README.md
```

## Funcionalidades incluidas

- Registro de usuario con `username`, `email` y `password`
- Contraseña almacenada con BCrypt
- Login que devuelve JWT
- Endpoints públicos para login y registro
- Endpoints protegidos con `Authorization: Bearer <token>`
- Gestión completa de tareas del usuario autenticado
- Cliente móvil reutilizando el mismo backend y los mismos endpoints
- Restricción para que cada usuario solo vea y modifique sus propias tareas
- Entidades `User`, `Task`, `Notification` y `AuditLog`
- Validaciones básicas y manejo de errores sencillo
- CORS configurado para `http://localhost:4201` y `http://localhost:4200`
- Datos iniciales opcionales

## Arquitectura del backend

El backend es un único proyecto Spring Boot, organizado internamente en servicios lógicos:

- `AuthService`
- `UserService`
- `TaskService`
- `NotificationService`
- `AuditLogService`

## Variables de entorno

Puedes copiar `.env.example` a `.env` si quieres personalizar la configuración:

```bash
cp .env.example .env
```

Variables principales:

- `POSTGRES_DB=task_manager`
- `POSTGRES_USER=task_user`
- `POSTGRES_PASSWORD=task_password`
- `POSTGRES_HOST_PORT=5433`
- `BACKEND_HOST_PORT=8081`
- `FRONTEND_HOST_PORT=4201`
- `APP_JWT_SECRET=<clave base64 para JWT>`
- `APP_CORS_ALLOWED_ORIGIN=http://localhost:4201,http://localhost:4200`
- `APP_SEED_ENABLED=true`

## Ejecución

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Cuando termine el arranque podrás acceder a:

- Frontend: [http://localhost:4200](http://localhost:4200)
- Backend: [http://localhost:8081](http://localhost:8081)

Con la configuración por defecto incluida en este repositorio, las URLs publicadas quedan así:

- Frontend: [http://localhost:4201](http://localhost:4201)
- Backend: [http://localhost:8081](http://localhost:8081)
- PostgreSQL: `localhost:5433`

Si alguno de esos puertos ya está ocupado en tu máquina, cambia solo el mapeo en `.env`:

```env
POSTGRES_HOST_PORT=5433
BACKEND_HOST_PORT=8081
FRONTEND_HOST_PORT=4201
```

En ese caso accederías a las URLs del puerto que hayas configurado.

## Datos iniciales opcionales

Si `APP_SEED_ENABLED=true`, el backend crea un usuario demo y una tarea inicial cuando la base de datos está vacía:

- Email: `demo@example.com`
- Password: `demo1234`

## Endpoints principales

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Tasks

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`
- `PATCH /api/tasks/{id}/complete`

## Resumen de carpetas

- [`backend/pom.xml`](/Users/pablo/Documents/app-gestion-tareas/backend/pom.xml): dependencias Maven y empaquetado del backend
- [`backend/src/main/java/com/example/taskmanager`](/Users/pablo/Documents/app-gestion-tareas/backend/src/main/java/com/example/taskmanager): código Java del proyecto
- [`backend/src/main/resources/application.properties`](/Users/pablo/Documents/app-gestion-tareas/backend/src/main/resources/application.properties): configuración del backend
- [`frontend/package.json`](/Users/pablo/Documents/app-gestion-tareas/frontend/package.json): dependencias Angular
- [`frontend/src/app`](/Users/pablo/Documents/app-gestion-tareas/frontend/src/app): componentes, rutas, servicios e interceptor
- [`mobile/package.json`](/Users/pablo/Documents/app-gestion-tareas/mobile/package.json): dependencias del cliente móvil Ionic
- [`mobile/src/app`](/Users/pablo/Documents/app-gestion-tareas/mobile/src/app): pantallas, servicios, guardas e interceptor del móvil
- [`docker-compose.yml`](/Users/pablo/Documents/app-gestion-tareas/docker-compose.yml): orquestación de frontend, backend y PostgreSQL

## Aplicación móvil

Se ha añadido un cliente móvil en [`mobile/`](/Users/pablo/Documents/app-gestion-tareas/mobile) usando **Ionic + Angular** y el mismo backend JWT del proyecto principal.

Pantallas disponibles:

- Login
- Registro
- Listado de tareas
- Crear tarea
- Editar tarea
- Eliminar tarea
- Marcar tarea como completada

### Ejecución del móvil

Desde la carpeta `mobile`:

```bash
npm install
npm run start
```

Para abrirlo en Android con Capacitor:

```bash
npm install
npm run sync
npm run android
```

### URL del backend en el móvil

El cliente móvil queda preparado así:

- En `ionic serve`: `http://localhost:8081/api`
- En emulador Android: `http://10.0.2.2:8081/api`

Si pruebas en un dispositivo físico, cambia la base URL en [`mobile/src/environments/environment.ts`](/Users/pablo/Documents/app-gestion-tareas/mobile/src/environments/environment.ts) por la IP local de tu máquina.

## Capturas recomendadas para la memoria

Estas capturas suelen cubrir bien la actividad:

1. `docker compose up --build` mostrando los tres contenedores levantados.
2. Pantalla de registro.
3. Pantalla de login.
4. Panel principal con listado de tareas.
5. Creación de una tarea nueva.
6. Edición de una tarea.
7. Marcado de tarea como completada.
8. Eliminación de una tarea.
9. Inspección del `localStorage` con el JWT guardado.
10. Petición protegida en el navegador o Postman mostrando la cabecera `Authorization: Bearer <token>`.
11. Vista de la base de datos con tablas `users`, `tasks`, `notifications` y `audit_logs`.

## Mejoras futuras posibles

- Guard para roles si quieres añadir administración
- Notificaciones visibles en frontend
- Paginación o filtros de tareas
- Tests unitarios y de integración
