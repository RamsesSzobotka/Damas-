# 🎮 Damas - Microservicios

Proyecto de Juego de Damas (Checkers) con arquitectura de microservicios.

## 📋 Servicios

- **Frontend**: TanStack Start (TypeScript, React, Vite)
- **Backend**: Bun + Hono (API REST)
- **IA Service**: Bun + Hono (Análisis de movimientos)
- **Database**: MongoDB

## 🚀 Quick Start

### 1. Clonar y configurar

```bash
# Copiar archivo de configuración
cp .env.example .env

# Editar .env con tus credenciales de Clerk y Stripe
```

### 2. Instalar dependencias

```bash
# Frontend
cd frontend
bun install
cd ..

# Backend
cd backend
bun install
cd ..

# IA Service
cd ia
bun install
cd ..
```

### 3. Levantar con Docker Compose

```bash
# Desde la carpeta services/
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

## 📡 URLs de Servicios

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **IA Service**: http://localhost:3002
- **MongoDB**: mongodb://localhost:27017


## 📚 Estructura

```
services/
├── frontend/         # TanStack Start
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
├── backend/          # Bun + Hono
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── ia/               # Bun + Hono
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── .gitignore
```

## 🔧 Configuración

### Archivos de Configuración

- `.env`: Variables de entorno (NO incluir en git)
- `frontend/.env.example`: Ejemplo para frontend
- `backend/.env.example`: Ejemplo para backend
- `ia/.env.example`: Ejemplo para IA service

### Variables Requeridas

**Clerk:**
- `CLERK_SECRET_KEY`
- `VITE_CLERK_PUBLISHABLE_KEY`

**Stripe:**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `VITE_STRIPE_PUBLISHABLE_KEY`

## 📦 Dependencias

### Frontend (TanStack Start)
- @tanstack/react-query ^5.28.0
- @tanstack/react-router ^1.28.0
- @tanstack/start ^1.28.0
- @clerk/tanstack-start
- zustand ^4.4.0
- tailwindcss ^3.3.3

### Backend (Bun + Hono)
- hono ^3.12.0
- mongodb ^6.3.0
- @clerk/backend
- stripe ^14.0.0
- zod ^3.22.0

### IA Service (Bun + Hono)
- hono ^3.12.0
- zod ^3.22.0

## 🐳 Docker

Todos los servicios están configurados con Dockerfile:

```bash
# Build individual
docker build -t damas-frontend ./frontend
docker build -t damas-backend ./backend
docker build -t damas-ia ./ia

# O usar docker-compose
docker-compose up -d
```

## 📝 Scripts Disponibles

### Frontend
```bash
bun run dev         # Desarrollo
bun run build       # Build
bun start           # Producción
bun run type-check  # TypeScript check
bun run lint        # ESLint
```

### Backend & IA
```bash
bun run dev         # Desarrollo con watch
bun run build       # Build
bun start           # Producción
bun typecheck       # TypeScript check
```

## 🤝 Desarrollo

### Desarrollo Local (sin Docker)

```bash
# Terminal 1 - Frontend
cd frontend
bun install
bun run dev

# Terminal 2 - Backend
cd backend
bun install
bun run dev

# Terminal 3 - IA
cd ia
bun install
bun run dev

# Terminal 4 - MongoDB
docker run -d -p 27017:27017 mongo:7.0
```

### Con Docker Compose (Recomendado)

```bash
docker-compose up -d
```

## 🐛 Troubleshooting

### MongoDB no conecta
```bash
# Verificar que MongoDB esté corriendo
docker-compose ps

# Ver logs
docker-compose logs mongodb
```

### Puerto ya en uso
```bash
# Cambiar puertos en docker-compose.yml
# O matar proceso en puerto
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :3002  # IA
```

### Dependencias no se instalan
```bash
# Limpiar e reinstalar
rm -rf node_modules
bun install
```

## 📖 Recursos

- [TanStack Start Docs](https://tanstack.com/start/latest)
- [Hono Docs](https://hono.dev)
- [Bun Docs](https://bun.sh/docs)
- [MongoDB Docs](https://docs.mongodb.com)
- [Clerk Docs](https://clerk.com/docs)
- [Stripe Docs](https://stripe.com/docs)

---

**Versión:** 1.0.0  
**Última actualización:** 26 de mayo de 2026
