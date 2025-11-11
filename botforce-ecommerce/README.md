# 🤖 BotForce - E-commerce de Bots y Automatizaciones

BotForce es un **e-commerce fullstack en TypeScript** para la venta de bots y automatizaciones (Telegram, Discord, WhatsApp y flujos n8n).  
El proyecto forma parte de una entrega integradora de tecnicatura y demuestra un stack moderno, documentado y desplegado con servicios gratuitos.

---

## 🧠 Stack Tecnológico

### Frontend
- [Next.js 15 (App Router)](https://nextjs.org/) + TypeScript  
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)  
- [NextAuth.js](https://authjs.dev/) para autenticación (Credentials)  
- Estado: Server Components  
- Deploy: **Vercel (Free Tier)**  

### Backend
- [Fastify](https://fastify.dev/) + TypeScript  
- [Prisma ORM](https://www.prisma.io/) + PostgreSQL (Neon)  
- [Zod](https://zod.dev/) para validación  
- [Mercado Pago Checkout Pro](https://www.mercadopago.com.ar/developers/panel)  
- [Cloudinary](https://cloudinary.com/) para almacenamiento de imágenes  
- Integración con **n8n** (webhook automatizado para validar pagos)  
- Deploy: **Render / Railway (Free Tier)**

### Infraestructura
- **Database:** Neon PostgreSQL (free)  
- **Automatización:** n8n (Railway / n8n Cloud)  
- **CI/CD:** GitHub Actions  
- **Versionado:** pnpm workspaces / Turborepo  

---

## 📁 Estructura de Carpetas (simplificada)

```
/bithub/
├── apps/
│   ├── frontend/            # Next.js + Tailwind + shadcn/ui
│   │   ├── src/
│   │   │   ├── app/         # rutas públicas y privadas
│   │   │   ├── components/  # UI components
│   │   │   ├── lib/         # helpers y utils
│   │   │   └── styles/
│   │   └── package.json
│   │
│   └── backend/             # Fastify API + Prisma + Mercado Pago
│       ├── src/
│       │   ├── routes/      # endpoints REST (bots, orders, auth, etc.)
│       │   ├── services/    # lógica de negocio
│       │   ├── lib/         # cloudinary, mp client, env
│       │   └── schemas/     # zod validation
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── seed.ts
│       └── package.json
│
├── packages/
│   └── shared/              # Tipos y Zod schemas compartidos
│       ├── src/
│       └── package.json
│
├── .github/workflows/ci.yml
├── .env.example
├── turbo.json
├── package.json
└── README.md
```

---

## 🧾 Brief del Proyecto

**Nombre:** BotForce – Marketplace de Bots y Automatizaciones  

**Descripción:**  
Plataforma de e-commerce donde los usuarios pueden comprar **bots y flujos de automatización listos para usar**, tales como bots de Telegram, Discord, WhatsApp o integraciones n8n.  
Tras la compra, **n8n** verifica el pago mediante webhook y **envía automáticamente** el enlace de descarga o acceso al comprador.  

**Objetivos del Proyecto:**
- Desarrollar un e-commerce funcional con autenticación, pasarela de pago y automatización post-pago.  
- Implementar un stack moderno TypeScript fullstack.  
- Desplegar todos los servicios en entornos gratuitos.  
- Documentar la arquitectura, base de datos y flujo de negocio.  

**Flujo de Compra (resumen):**
1. El usuario navega y selecciona un bot del catálogo.  
2. Crea una orden pendiente y es redirigido a **Mercado Pago Checkout Pro**.  
3. **n8n** recibe el webhook de MP, valida el pago y actualiza la orden en el backend.  
4. **n8n** envía un correo con el enlace de descarga (Cloudinary o repositorio).  

**Stack Completo:**
| Capa | Tecnología |
|------|-------------|
| Frontend | Next.js + TypeScript + Tailwind + shadcn/ui |
| Backend | Fastify + Prisma + Zod |
| DB | PostgreSQL (Neon) |
| Auth | NextAuth (Credentials) |
| Pagos | Mercado Pago (Checkout Pro) |
| Automatización | n8n |
| Almacenamiento | Cloudinary |
| Deploy | Vercel (Front) + Render/Railway (Back) + Neon (DB) |

---

**Desarrollado por:** Gabriel Valdés 
**Año:** 2025  
**Licencia:** MIT
