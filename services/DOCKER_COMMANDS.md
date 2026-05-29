# Docker Commands - Damas Project

## Directorio Base
Todos los comandos se ejecutan desde:
```bash
cd C:\Users\ramse\Documents\Universidad\Des_Software IX\Damas-\services
```

---

## 🚀 Iniciar Servicios

### Iniciar todos los servicios (build + run)
```bash
docker-compose up --build
```

### Iniciar servicios sin rebuilding
```bash
docker-compose up
```

### Iniciar servicios en background (detach mode)
```bash
docker-compose up -d
```

### Iniciar servicios en background con build
```bash
docker-compose up -d --build
```

---

## 🛑 Detener Servicios

### Detener todos los servicios
```bash
docker-compose down
```

### Detener y remover volúmenes (reset completo)
```bash
docker-compose down -v
```

### Detener un servicio específico
```bash
docker-compose stop backend
docker-compose stop ia
docker-compose stop frontend
docker-compose stop mongodb
```

### Remover contenedores específicos (sin detener)
```bash
docker-compose rm -f backend
docker-compose rm -f ia
docker-compose rm -f frontend
```

---

## 📊 Ver Logs

### Ver logs de todos los servicios
```bash
docker-compose logs
```

### Ver logs de un servicio específico
```bash
# Backend
docker-compose logs backend

# IA Service
docker-compose logs ia

# Frontend
docker-compose logs frontend

# MongoDB
docker-compose logs mongodb
```

### Ver logs en tiempo real (follow mode)
```bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f backend
docker-compose logs -f ia
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Últimas N líneas de logs
```bash
# Últimas 100 líneas
docker-compose logs --tail=100

# Últimas 100 líneas de frontend en tiempo real
docker-compose logs -f --tail=100 frontend
```

---

## 🔧 Ejecutar Comandos en Contenedores

### Acceder a un contenedor (bash/shell)
```bash
# Backend
docker-compose exec backend bash

# Frontend
docker-compose exec frontend bash

# IA
docker-compose exec ia bash

# MongoDB
docker-compose exec mongodb mongosh
```

### Ejecutar comandos sin acceso interactivo
```bash
# Ver la estructura del directorio en backend
docker-compose exec backend ls -la

# Instalar un paquete en frontend
docker-compose exec frontend bun add <package-name>

# Ejecutar tests
docker-compose exec backend bun test
```

---

## 🔍 Ver Estado de Servicios

### Listar contenedores activos
```bash
docker-compose ps
```

### Ver información detallada de un contenedor
```bash
docker inspect damas-backend
docker inspect damas-frontend
docker inspect damas-ia
docker inspect damas-mongodb
```

---

## 🏗️ Rebuild y Reconstrucción

### Reconstruir un servicio específico
```bash
docker-compose build backend
docker-compose build frontend
docker-compose build ia
```

### Reconstruir todos sin cache
```bash
docker-compose build --no-cache
```

### Reconstruir e iniciar un servicio específico
```bash
docker-compose up -d --build backend
docker-compose up -d --build frontend
docker-compose up -d --build ia
```

---

## 🐛 Debugging

### Ver logs con timestamps
```bash
docker-compose logs --timestamps
```

### Ver eventos en tiempo real
```bash
docker-compose events
```

### Inspeccionar variables de entorno de un servicio
```bash
docker-compose exec backend env | sort
```

### Verificar conectividad entre servicios (desde un contenedor)
```bash
# Desde frontend, probar conexión a backend
docker-compose exec frontend curl -v http://backend:3001

# Desde backend, probar conexión a MongoDB
docker-compose exec backend curl -v mongodb://mongodb:27017
```

---

## 📈 Monitoreo y Performance

### Ver uso de recursos de contenedores
```bash
docker stats
```

### Ver logs con tail y follow en formato limpio
```bash
docker-compose logs -f --no-log-prefix
```

---

## 🧹 Limpieza

### Remover contenedores parados
```bash
docker container prune
```

### Remover imágenes no usadas
```bash
docker image prune
```

### Remover volúmenes no usados
```bash
docker volume prune
```

### Limpieza completa (usar con cuidado)
```bash
docker-compose down -v
docker system prune -a
```

---

## 📋 Acceso a Servicios

Una vez iniciados, acceder a:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **IA Service**: http://localhost:3002
- **MongoDB**: localhost:27017 (interno)

---

## 🆘 Troubleshooting

### Si un servicio no inicia, revisar logs
```bash
docker-compose logs backend --tail=50
```

### Si MongoDB falla (port 27017 en uso)
```bash
# Verificar qué usa el puerto
netstat -ano | findstr :27017

# O desde PowerShell
Get-NetTCPConnection -LocalPort 27017 -ErrorAction SilentlyContinue
```

### Si frontend no se actualiza (hot reload no funciona)
```bash
# Asegurar que vite.config.ts tiene HMR configurado
# Luego hacer rebuild
docker-compose up -d --build frontend
```

### Remover todo y empezar desde cero
```bash
docker-compose down -v --remove-orphans
docker-compose up --build
```

---

## 💡 Comandos Útiles Combinados

### Restart de un servicio
```bash
docker-compose restart backend
docker-compose restart ia
docker-compose restart frontend
```

### Ver logs y seguir cambios en tiempo real
```bash
docker-compose logs -f --tail=50
```

### Detener, remover y volver a iniciar (reset suave)
```bash
docker-compose down && docker-compose up -d
```

### Reset completo (borra volúmenes de BD)
```bash
docker-compose down -v && docker-compose up -d --build
```
