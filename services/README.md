# 🎮 Damas — Microservicios

Este directorio contiene los 3 microservicios del proyecto Damas Universe.

> **Toda la documentación del proyecto está en [`../README.md`](../README.md)** (raíz del repositorio).

## Servicios

| Directorio | Stack | Puerto |
|------------|-------|:------:|
| [`frontend/`](./frontend/) | TanStack Start (React 19 + SSR) | `3000` |
| [`backend/`](./backend/) | Bun + Hono (API REST + WebSocket) | `3001` |
| [`ia/`](./ia/) | Bun + Hono (Motor IA A\* puro) | `3002` |

## Quick Start

```bash
# Levantar todo (4 contenedores)
docker compose up -d

# Desarrollo local
cd frontend && bun install && bun run dev
cd backend  && bun install && bun run dev
cd ia       && bun install && bun run dev
```

**Ver documentación completa:** [`../README.md`](../README.md)
