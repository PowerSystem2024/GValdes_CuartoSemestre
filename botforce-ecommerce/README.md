# 🧠 BotForce — Plataforma de Automatizaciones

BotForce es un e-commerce full stack para la venta, gestión y distribución de **automatizaciones, bots y scripts personalizados**, como bots de WhatsApp, Telegram, Discord, scraping de datos, integraciones con APIs, RPA (Selenium) y más.

---

## 🖥️ Link del video de presentación (drive)
https://drive.google.com/file/d/1POrvXKeT_TlFmnCjCPQaTDfJxzOQ8dzB/view?usp=sharing

---

## 🚀 Estado del Proyecto

📍 **Actualmente en desarrollo local**  
🧩 Backend y frontend funcionan correctamente en entorno local.  
☁️ **Despliegue en progreso**:  
- Backend → [Railway.app](https://railway.app)  
- Frontend → [Vercel.com](https://vercel.com)

---

## 🧰 Stack Tecnológico

### 🖥️ Frontend
- [Next.js 14 (App Router)](https://nextjs.org/)
- TypeScript
- TailwindCSS
- [shadcn/ui](https://ui.shadcn.com/) para componentes
- Sonner (toasts)
- Axios para llamadas API
- Persistencia de carrito en `localStorage`

### ⚙️ Backend
- [Fastify](https://fastify.dev/)
- Prisma ORM + PostgreSQL
- JWT Authentication (middleware custom)
- Cloudinary para subida de imágenes
- MercadoPago SDK (checkout & webhooks)
- CORS configurado con soporte a credenciales
- Deploy-ready para Railway

---

## 📁 Estructura de Carpetas

```
botforce-ecommerce/
├── apps/
│   ├── backend/           # API Fastify + Prisma
│   └── frontend/          # Next.js 14 + Tailwind + shadcn
├── prisma/
│   └── schema.prisma      # Esquema de base de datos
└── package.json           # Configuración del monorepo
```

---

## ⚙️ Variables de Entorno

### 🔸 Backend (.env)
```
DATABASE_URL="postgresql://user:pass@localhost:5432/botforce"
JWT_SECRET="clave-super-segura"
PORT=3333
FRONTEND_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
CLOUDINARY_FOLDER="botforce/products"

# MercadoPago
MP_ACCESS_TOKEN="TEST-..."
MP_PUBLIC_KEY="TEST-..."
```

### 🔸 Frontend (.env.local)
```
NEXT_PUBLIC_API_URL="http://localhost:3333"
NEXT_PUBLIC_MP_PUBLIC_KEY="TEST-..."
```

---

## 🧩 Instalación y Puesta en Marcha (Local)

> Asegurate de tener **Node.js 18+** y **PostgreSQL** instalados y corriendo.

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/<tu_usuario>/botforce-ecommerce.git
cd botforce-ecommerce
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Configurar variables de entorno
Crear los archivos:
- `apps/backend/.env`
- `apps/frontend/.env.local`
(usar los ejemplos de arriba)

### 4️⃣ Generar la base de datos
Desde la carpeta del backend:
```bash
cd apps/backend
npx prisma generate
npx prisma migrate dev --name init
```

### 5️⃣ Iniciar backend
```bash
npm run dev
```
> Servidor disponible en `http://localhost:3333`

### 6️⃣ Iniciar frontend
En otra terminal:
```bash
cd ../frontend
npm run dev
```
> Aplicación disponible en `http://localhost:3000`

---

## 🧾 Funcionalidades Principales

| Módulo | Descripción |
|--------|--------------|
| 🧍‍♂️ Autenticación | Registro, login y JWT persistente |
| 🛒 Carrito | Agregar, persistir y eliminar productos localmente |
| 🧑‍💻 Productos | CRUD completo con subida de imagen a Cloudinary |
| 💳 Pagos | Integración con MercadoPago (checkout y webhooks) |
| ⚙️ Admin Dashboard | Creación y edición de productos con protección por rol |
| 🌐 CORS | Configurado con credenciales para frontend en `localhost:3000` |
| 🖼️ Login UI | Imagen ilustrativa con colores reales |
| 🧾 Catálogo | Scroll suave hasta el catálogo + cards de productos |
| 📬 Contacto | Formulario para interesados en comprar o vender automatizaciones |

---

## 🧑‍💼 Despliegue (en progreso)

### 🔹 Backend → Railway
1. Crear un proyecto y base de datos PostgreSQL.
2. Configurar Root Directory → `apps/backend`.
3. Cargar variables `.env` en Railway.
4. Ejecutar migraciones:
   ```bash
   npm run migrate:deploy
   ```
5. Railway genera un dominio público, ej:  
   `https://botforce-api.up.railway.app`

### 🔹 Frontend → Vercel
1. Importar el repo desde GitHub.
2. Root Directory → `apps/frontend`.
3. Variables de entorno:
   ```
   NEXT_PUBLIC_API_URL=https://botforce-api.up.railway.app
   NEXT_PUBLIC_MP_PUBLIC_KEY=...
   ```
4. Deploy automático → dominio `.vercel.app`.

---

## 🧪 Pruebas básicas locales

| Acción | Endpoint / Página | Descripción |
|--------|--------------------|-------------|
| Healthcheck | `GET /health` | Verifica que el backend está vivo |
| Registro | `/register` | Crear nuevo usuario |
| Login | `/login` | Genera JWT |
| Listado público | `/api/products` | Lista productos activos |
| Dashboard | `/dashboard` | CRUD admin protegido |
| Contacto | `/` → scroll a contacto | Formulario de interesados |

---

## 💡 Próximos pasos

- [ ] Corregir checkout
- [ ] Publicar backend en Railway (stage)
- [ ] Deploy frontend en Vercel


---

## 🧾 Licencia
Proyecto académico / comercial en desarrollo — © 2025 BotForce.
