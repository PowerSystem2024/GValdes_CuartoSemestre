# 🌀 Proyecto PERN — Gestor de Tareas

Aplicación **Full Stack** desarrollada con el stack **PERN** (PostgreSQL, Express, React, Node.js) que permite a los usuarios **registrarse, iniciar sesión y gestionar sus tareas personales** de forma segura mediante autenticación JWT y persistencia en base de datos.

---

## 🚀 Tecnologías principales

- **PostgreSQL** → base de datos relacional para usuarios y tareas  
- **Express.js** → servidor backend con API REST y middlewares de autenticación  
- **React.js (Vite)** → frontend moderno con componentes reutilizables y hooks  
- **Node.js** → entorno de ejecución para el backend  
- **JWT** → autenticación segura por tokens  
- **Docker Compose** → contenedor para la base de datos PostgreSQL

---

## ⚙️ Instalación y configuración

A continuación se detalla cómo levantar el proyecto completo desde cero.

### 1️⃣ Clonar el repositorio

A modo de ejemplo dejo este paso

### 2️⃣ Configurar la base de datos (Docker)

Dentro del proyecto encontrarás un archivo `docker-compose.yml` como el siguiente:

```yml
version: "3.9"

services:
  postgres:
    image: postgres:16
    container_name: pern_postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: PERN
    ports:
      - "5432:5432"
    volumes:
      - ./database:/docker-entrypoint-initdb.d
```

🔹 Este servicio levanta una base de datos PostgreSQL llamada **PERN** con usuario y contraseña `postgres`.

Ejecutar el contenedor:

```bash
docker compose up -d
```

Verificar que el contenedor esté corriendo:

```bash
docker ps
```

---

### 3️⃣ Inicializar las tablas

Si no se inicializan automáticamente, podés hacerlo desde `SQL Shell (psql)`:

```sql
\c PERN;
\i 'C:/ruta/del/proyecto/database/init.sql';
```

Esto creará las tablas `usuarios` y `tareas`.

---

### 4️⃣ Configurar y ejecutar el Backend

Entrar a la carpeta del backend:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar el servidor:

```bash
npm run dev
```

Por defecto corre en:
```
http://localhost:3000
```

Rutas principales:

| Método | Ruta             | Descripción |
|--------|------------------|-------------|
| POST   | `/api/register`  | Registro de usuario |
| POST   | `/api/login`     | Inicio de sesión |
| GET    | `/api/tareas`    | Listar tareas del usuario |
| POST   | `/api/tareas`    | Crear nueva tarea |
| PUT    | `/api/tareas/:id`| Editar tarea |
| DELETE | `/api/tareas/:id`| Eliminar tarea |

---

### 5️⃣ Configurar y ejecutar el Frontend

Abrir otra terminal y moverse al directorio del front:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Levantar el entorno de desarrollo:

```bash
npm run dev
```

Por defecto corre en:
```
http://localhost:5173
```

---

### 6️⃣ Probar la aplicación

1. Abrí el navegador en [http://localhost:5173](http://localhost:5173)  
2. Registrate con un nuevo usuario  
3. Iniciá sesión  
4. Creá, editá y eliminá tareas  
5. Cerrá sesión con el botón **Salir**

---

## 💡 Resumen del Proyecto

El **Gestor de Tareas PERN** permite a cada usuario administrar sus propias tareas con operaciones CRUD protegidas por autenticación.  
El sistema se comunica entre frontend y backend mediante **Axios**, y usa **cookies HTTP-only** para mantener la sesión activa.  
Todo el flujo se apoya en una **API REST segura y modular**, acompañada de una **interfaz moderna y limpia**, adaptable a pantallas grandes y pequeñas.

---

## 👤 Autor

**Proyecto adaptado y desarrollado por [Gabriel Valdés](https://github.com/bkt93)**  

<p align="center">
  <a href="https://github.com/bkt93" target="_blank">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="40" height="40" alt="GitHub Logo"/>
  </a>
</p>

