# 📑 Wireframes - Índice de Archivos

**Carpeta:** `/Docs/wireframes/`  
**Última actualización:** 26 de mayo de 2026  
**Total archivos:** 7  

---

## 📄 Archivos en Esta Carpeta

### 📋 Documentación General

| Archivo | Descripción | Lectura |
|---------|-------------|---------|
| **README.md** | Índice principal de wireframes | 5 min |
| **GUIA-VISUAL.md** | Guía completa de estilos y colores | 10 min |
| **INDEX.md** | Este archivo (lista de navegación) | 2 min |

### 🎮 Wireframes Principales

| # | Archivo | Pantalla | Focus Principal | Estado |
|---|---------|----------|-----------------|--------|
| 1 | **01-menu-principal.md** | Menú Inicial | Login + Navegación | ✅ Completo |
| 2 | **02-seleccion-dificultad.md** | Seleccionar Nivel | Tarjetas de dificultad | ✅ Completo |
| 3 | **03-pantalla-juego.md** | Juego Activo | **Perfil + Tablero + Historial** | ✅ Completo |
| 4 | **04-rankings.md** | Tabla de Scores | Top 10 + Tu posición | ✅ Completo |
| 5 | **05-tienda.md** | Shop de Skins | Grid de productos | ✅ Completo |

---

## 🎯 Matriz de Navegación

```
                    ┌─ Menu Principal (01)
                    │
    Usuario entra ──┤─ Elige Dificultad (02)
                    │
                    └─ Pantalla Juego (03)
                        ├─ Durante juego
                        ├─ Ver Ranking (04)
                        └─ Abrir Tienda (05)

LOGIN: Disponible en TODAS las pantallas (esquina superior derecha)
```

---

## 📝 Lectura Recomendada

### Para Implementar Interfaz (Frontend)
1. **GUIA-VISUAL.md** (colores, espaciado, componentes)
2. **01-menu-principal.md** (punto de entrada)
3. **03-pantalla-juego.md** (componente más complejo)

### Para Entender Flujo de Usuario
1. **README.md** (visión general)
2. **01-menu-principal.md** (inicio)
3. **02-seleccion-dificultad.md** (decisión)
4. **03-pantalla-juego.md** (juego)

### Para Seguir Especificaciones de Diseño
1. **DESIGN-PIXELART.SKILL.md** (estilo visual)
2. **GUIA-VISUAL.md** (paleta y componentes)
3. Cada wireframe (detalles específicos)

---

## 🔍 Búsqueda Rápida

### "¿Dónde va el botón LOGIN?"
→ **GUIA-VISUAL.md** (Sección: Flujo de Autenticación)  
→ Esquina superior derecha en TODAS las pantallas

### "¿Cuál es la paleta de colores?"
→ **GUIA-VISUAL.md** (Sección: Paleta de Colores Global)

### "¿Cómo se vé la pantalla de juego?"
→ **03-pantalla-juego.md** (Diagrama ASCII + especificaciones)

### "¿Dónde va el perfil del jugador?"
→ **03-pantalla-juego.md** (Sección: Header - Información de Jugadores)  
→ Esquina superior izquierda

### "¿Cómo es el tablero?"
→ **03-pantalla-juego.md** (Sección: Panel Principal - Área de Juego)

### "¿Qué dimensiones tiene?"
→ **GUIA-VISUAL.md** (Sección: Espaciado Estándar)

---

## 📊 Estadísticas de Wireframes

```
Total pantallas diseñadas: 5
Total componentes: 15+
Total especificaciones: 100+
Líneas de documentación: 1500+
Diagramas ASCII: 10+
Responsive breakpoints: 3 (mobile, tablet, desktop)
Estados interactivos: 20+
```

---

## ✅ Checklist de Lectura

- [ ] README.md - Contexto general
- [ ] GUIA-VISUAL.md - Colores y estilos
- [ ] 01-menu-principal.md - Primer wireframe
- [ ] 02-seleccion-dificultad.md - Segundo nivel
- [ ] 03-pantalla-juego.md - Componente principal (Perfil + Tablero + Historia)
- [ ] 04-rankings.md - Tabla de scores
- [ ] 05-tienda.md - Shop

---

## 🎨 Características Destacadas

### 1️⃣ Menu Principal
- ✅ Logo centrado
- ✅ 5 botones principales
- ✅ **Login en esquina superior derecha**
- ✅ Footer con info
- ✅ Responsive 3 breakpoints

### 2️⃣ Selección de Dificultad
- ✅ 4 tarjetas de dificultad (🟢 🟡 🔴 ⚫)
- ✅ Grid 2x2 en desktop, 1 columna en mobile
- ✅ Colores diferenciados
- ✅ Estados de selección

### 3️⃣ Pantalla de Juego ⭐ (PRINCIPAL)
- ✅ **Perfil jugador (esquina superior izquierda)**
  - Avatar 24x24
  - Nombre usuario
  - Puntos acumulados
  - Fichas en juego
  
- ✅ **Turno (esquina superior centro)**
  - Indicador ROJO/AZUL
  - Parpadeo durante turno
  
- ✅ **Login (esquina superior derecha)**
  - Consistente con todas las pantallas
  
- ✅ **Tablero 8x8 (centro)**
  - 512x512 en desktop (escala 2x)
  - 256x256 en mobile (escala 1x)
  - Casillas interactivas
  - Fichas animadas
  
- ✅ **Panel control (izquierda)**
  - Info IA
  - Botones (Deshacer, Opciones, Salir)
  - Estado fichas
  
- ✅ **Historial (derecha)**
  - Movimientos scrolleable
  - Último resaltado
  
- ✅ **Status bar (abajo)**
  - Tiempo partida
  - FPS
  - Estado actual

### 4️⃣ Rankings
- ✅ Top 10 tabla
- ✅ Filtros por dificultad
- ✅ Medallas 🥇 🥈 🥉
- ✅ Tu posición resaltada

### 5️⃣ Tienda
- ✅ Grid de skins
- ✅ Filtros y ordenamiento
- ✅ Rareza con colores
- ✅ Carrito de compras

---

## 🔗 Enlaces Rápidos

```
DOCUMENTACIÓN RELACIONADA:
/Docs/PRD.md                           ← Requerimientos
/Docs/DATABASE.md                      ← Estructura base de datos
/Docs/DATABASE-RELATIONS.md            ← Relaciones BD
/Docs/agents/DESIGN-PIXELART.SKILL.md  ← Estilo visual

CARPETA FRONTEND (después de implementación):
/services/frontend/src/components/
/services/frontend/src/pages/
/services/frontend/src/types/
```

---

## 🚀 Próximos Pasos

### Fase 1: Implementación Base
1. [ ] Crear componentes base (Button, Card, Modal)
2. [ ] Implementar Menu Principal
3. [ ] Implementar Selección Dificultad
4. [ ] Setup de routing (TanStack Router)

### Fase 2: Juego Principal
1. [ ] Crear componente GameBoard (8x8)
2. [ ] Componente PlayerProfile
3. [ ] Componente ControlPanel
4. [ ] Componente MoveHistory
5. [ ] Integrar lógica de turnos

### Fase 3: Secundarios
1. [ ] Tabla de Rankings
2. [ ] Shop de Skins
3. [ ] Modals (Opciones, Confirmación)

### Fase 4: Polish
1. [ ] Animaciones avanzadas
2. [ ] Efectos visuales
3. [ ] Responsividad refinada
4. [ ] Testing y optimización

---

## 💡 Tips para Desarrolladores

### Color Picking
Abrir `GUIA-VISUAL.md` → Sección "Paleta de Colores Global"

### Spacing
Abrir `GUIA-VISUAL.md` → Sección "Espaciado Estándar"

### Responsive
Abrir `GUIA-VISUAL.md` → Sección "Estrategia Responsive"

### Componentes
Abrir `GUIA-VISUAL.md` → Sección "Paleta de Colores Global"

### Animaciones
Abrir `GUIA-VISUAL.md` → Sección "Animaciones Globales"

---

## 📞 Contacto

- **Diseño:** Equipo UI/UX
- **Frontend:** Frontend lead
- **Backend:** Backend lead
- **Estado:** Aprobado y listo para implementación

---

**Creado:** 26 de mayo de 2026  
**Versión:** 1.0 - Completo  
**Estado:** ✅ Producción
