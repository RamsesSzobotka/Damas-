# 🎮 Wireframe - Menú Principal

**Componente:** Menu Principal  
**Versión:** 1.0  
**Responsable:** UI/UX Design  
**Estado:** ✅ Aprobado  

---

## 📐 Diagrama ASCII

```
┌────────────────────────────────────────────────────────────────┐
│                                          ┌──────────────────┐  │
│                                          │  [LOGIN/PROFILE] │  │ ← Auth Button
│                                          │                  │  │   (Esquina superior derecha)
│                                          └──────────────────┘  │
│                                                                 │
│                                                                 │
│                                                                 │
│                          ╔════════════════╗                    │
│                          ║     DAMAS      ║                    │
│                          ║    Checkers    ║                    │
│                          ╚════════════════╝                    │
│                                                                 │
│                          Logo Pixel Art 64x64                   │
│                          (Tablero con fichas)                   │
│                                                                 │
│                                                                 │
│            ┌────────────────────────────────────┐              │
│            │                                    │              │
│            │      ┌──────────────────┐          │              │
│            │      │   ► JUGAR        │          │              │
│            │      └──────────────────┘          │              │
│            │                                    │              │
│            │      ┌──────────────────┐          │              │
│            │      │   📊 RANKINGS    │          │              │
│            │      └──────────────────┘          │              │
│            │                                    │              │
│            │      ┌──────────────────┐          │              │
│            │      │   🛍️  TIENDA     │          │              │
│            │      └──────────────────┘          │              │
│            │                                    │              │
│            │      ┌──────────────────┐          │              │
│            │      │   ⚙️  OPCIONES   │          │              │
│            │      └──────────────────┘          │              │
│            │                                    │              │
│            │      ┌──────────────────┐          │              │
│            │      │   ❌ SALIR       │          │              │
│            │      └──────────────────┘          │              │
│            │                                    │              │
│            └────────────────────────────────────┘              │
│                                                                 │
│                                                                 │
│  Versión: 1.0.0  │  © 2026 Damas Digital  │  Apoyado por [?] │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Zonas y Dimensiones

### Header - Autenticación (Esquina Superior Derecha)

```
┌──────────────────────────────┐
│ Zona: Esquina superior-derecha│
│ Alto: 40px                   │
│ Ancho: 200px (máx)           │
│ Padding: 8px                 │
│                              │
│ ❌ SIN AUTENTICAR:           │
│ ┌────────────────────────┐   │
│ │ [LOGIN / SIGN UP]      │   │ ← Botón verde #33AA33
│ └────────────────────────┘   │
│                              │
│ ✅ AUTENTICADO:              │
│ ┌─────────────────────────┐  │
│ │ 👤 JugadorPro123 ▼      │  │ ← Dropdown menu
│ └─────────────────────────┘  │
│    (Avatar 16x16 + Nombre)   │
│                              │
└──────────────────────────────┘

ESTADOS:
- Normal: #CCCCCC texto, fondo transparent
- Hover: Fondo #16213E (0.3 opacity)
- Clicked: Mostrar dropdown con opciones
  ├─ Ver Perfil
  ├─ Configuración
  └─ Cerrar Sesión
```

---

### Área Principal - Contenido Central

```
┌────────────────────────────────────────┐
│                                        │
│          Logo DAMAS 64x64              │ ← Pixel art tablero
│                                        │
│    DAMAS - Checkers Clásico Retro     │ ← Título 24px bold
│                                        │
│  "Desafía a la IA en el juego clásico"│ ← Subtitle 12px
│                                        │
└────────────────────────────────────────┘

Dimensiones:
- Logo: 64x64px
- Título: 24px font, #FFFFFF
- Subtitle: 12px font, #CCCCCC
- Spacing total: 80px alto
```

---

### Área de Botones - Menú Principal

```
┌─────────────────────────────────────────┐
│  BOTONES PRINCIPALES (Centrados)       │
│                                         │
│  Layout: 1 columna, 5 filas             │
│  Ancho botón: 200px                     │
│  Alto botón: 40px                       │
│  Separación vertical: 16px              │
│                                         │
│  ┌────────────────────────────┐        │
│  │  ► JUGAR                   │        │ 1
│  │  (Comenzar nueva partida)  │        │
│  └────────────────────────────┘        │
│           ↓ 16px                        │
│  ┌────────────────────────────┐        │
│  │  📊 RANKINGS               │        │ 2
│  │  (Ver tabla de puntuaciones)        │
│  └────────────────────────────┘        │
│           ↓ 16px                        │
│  ┌────────────────────────────┐        │
│  │  🛍️  TIENDA                 │        │ 3
│  │  (Comprar skins personalizados)    │
│  └────────────────────────────┘        │
│           ↓ 16px                        │
│  ┌────────────────────────────┐        │
│  │  ⚙️  OPCIONES              │        │ 4
│  │  (Volumen, controles, etc) │        │
│  └────────────────────────────┘        │
│           ↓ 16px                        │
│  ┌────────────────────────────┐        │
│  │  ❌ SALIR                   │        │ 5
│  │  (Cerrar aplicación)       │        │
│  └────────────────────────────┘        │
│                                         │
└─────────────────────────────────────────┘

ESTILOS BOTÓN:
Normal:
  - Fondo: #33AA33
  - Texto: #FFFFFF, 12px bold
  - Borde: 2px relief 3D (arriba-izq claro, abajo-der oscuro)
  
Hover:
  - Fondo: #44BB44 (+10% brillo)
  - Cursor: pointer
  - Efecto: Más brillo
  
Pressed:
  - Fondo: #228822
  - Borde: invertido (hundido)
  - Offset: 1px hacia abajo-derecha
```

---

### Footer - Información

```
┌────────────────────────────────────────┐
│  Versión: 1.0.0                        │
│  © 2026 Damas Digital                  │
│  Desarrollado por: Equipo SDD IX       │
│                                        │
│  Fuente: 8px, #999999 (gris oscuro)   │
│  Fondo: #0F3460 (panel oscuro)         │
│  Borde superior: 1px #33AA33           │
│  Alto: 32px                            │
│  Padding: 8px                          │
└────────────────────────────────────────┘
```

---

## 🎨 Especificaciones de Color

| Elemento | Color | Hex | RGB |
|----------|-------|-----|-----|
| Fondo principal | Azul muy oscuro | #1A1A2E | 26,26,46 |
| Botones normal | Verde | #33AA33 | 51,170,51 |
| Botones hover | Verde claro | #44BB44 | 68,187,68 |
| Botones pressed | Verde oscuro | #228822 | 34,136,34 |
| Texto principal | Blanco | #FFFFFF | 255,255,255 |
| Texto secundario | Gris claro | #CCCCCC | 204,204,204 |
| Borde activo | Naranja | #FFAA00 | 255,170,0 |
| Panel oscuro | Azul oscuro | #0F3460 | 15,52,96 |

---

## 📐 Espaciado

```
Margen exterior panel: 24px
Padding panel: 16px
Separación botones (vertical): 16px
Separación horizontal botones: Auto (centrado)
Margen footer: 0px (full width)

Responsive:
Mobile (< 480px):
  - Margen: 12px
  - Botón ancho: 100% - 24px
  - Font: -2px

Tablet (480px - 1024px):
  - Margen: 20px
  - Botón ancho: 240px
  - Font: Normal

Desktop (> 1024px):
  - Margen: 40px
  - Botón ancho: 200px
  - Font: Normal
```

---

## 🔘 Interacciones

### Click "JUGAR"
```
1. Efecto presión (100ms) ✓
2. Fade out pantalla (200ms)
3. Cargar pantalla selección dificultad
4. Fade in (200ms)
5. Focus automático en primer botón dificultad
```

### Click "RANKINGS"
```
1. Efecto presión (100ms) ✓
2. Fade out pantalla (200ms)
3. Cargar tabla rankings
4. Fade in (200ms)
5. Scroll automático a posición del jugador
```

### Click "TIENDA"
```
1. Efecto presión (100ms) ✓
2. Fade out pantalla (200ms)
3. Cargar tienda
4. Fade in (200ms)
5. Scroll automático a skins destacados
```

### Click "LOGIN/PROFILE"
```
NO AUTENTICADO:
1. Click → Abre modal Clerk
2. Usuario completa login
3. Redirecciona a Menu Principal
4. Muestra perfil en esquina

AUTENTICADO:
1. Click → Dropdown menu
2. Hover opciones → Highlight #16213E
3. Click opción → Confirmar/Ejecutar
```

---

## 📱 Responsive Design

### Móvil (320px - 480px)
```
┌────────────────────────┐
│ [LOGIN] (esquina arr)  │
│                        │
│    Logo 48x48          │
│                        │
│    DAMAS (18px)        │
│    Subtitle (10px)     │
│                        │
│  ┌──────────────────┐  │
│  │  ► JUGAR         │  │ ← 100% ancho - 24px
│  └──────────────────┘  │
│  ┌──────────────────┐  │
│  │  📊 RANKINGS     │  │
│  └──────────────────┘  │
│  ┌──────────────────┐  │
│  │  🛍️  TIENDA      │  │
│  └──────────────────┘  │
│  ┌──────────────────┐  │
│  │  ⚙️  OPCIONES    │  │
│  └──────────────────┘  │
│  ┌──────────────────┐  │
│  │  ❌ SALIR        │  │
│  └──────────────────┘  │
│                        │
│   (Footer 8px)         │
└────────────────────────┘
```

### Tablet (768px - 1024px)
```
┌──────────────────────────────────┐
│ [LOGIN] (esquina arr)            │
│                                  │
│      Logo 64x64                  │
│      DAMAS (24px)                │
│      Subtitle (12px)             │
│                                  │
│      ┌──────────────────┐        │
│      │  ► JUGAR         │        │
│      └──────────────────┘        │
│      ┌──────────────────┐        │
│      │  📊 RANKINGS     │        │
│      └──────────────────┘        │
│      ┌──────────────────┐        │
│      │  🛍️  TIENDA      │        │
│      └──────────────────┘        │
│      ┌──────────────────┐        │
│      │  ⚙️  OPCIONES    │        │
│      └──────────────────┘        │
│      ┌──────────────────┐        │
│      │  ❌ SALIR        │        │
│      └──────────────────┘        │
│                                  │
└──────────────────────────────────┘
```

### Desktop (1024px+)
```
┌────────────────────────────────────────────┐
│ [LOGIN] (esquina arr)                      │
│                                            │
│            Logo 64x64                      │
│            DAMAS (24px bold)               │
│            Subtitle (12px)                 │
│                                            │
│          ┌──────────────────┐              │
│          │  ► JUGAR         │              │
│          └──────────────────┘              │
│          ┌──────────────────┐              │
│          │  📊 RANKINGS     │              │
│          └──────────────────┘              │
│          ┌──────────────────┐              │
│          │  🛍️  TIENDA      │              │
│          └──────────────────┘              │
│          ┌──────────────────┐              │
│          │  ⚙️  OPCIONES    │              │
│          └──────────────────┘              │
│          ┌──────────────────┐              │
│          │  ❌ SALIR        │              │
│          └──────────────────┘              │
│                                            │
│ (Footer con info)                          │
└────────────────────────────────────────────┘
```

---

## 🔐 Autenticación - Estados Detallados

### Estado 1: No Autenticado

```
Ubicación: Esquina superior derecha
┌────────────────────────┐
│ [LOGIN / SIGN UP]      │ ← Verde #33AA33
│ 40px altura × 180px    │
└────────────────────────┘

Click → Modal Clerk aparece:
┌──────────────────────────────────┐
│  Clerk Sign In                   │
│  ─────────────────────────────   │
│                                  │
│  Email: [___________________]    │
│  Password: [________________]    │
│                                  │
│  [Iniciar Sesión] [Registrarse] │
│                                  │
│  ¿No tienes cuenta? Regístrate   │
│                                  │
└──────────────────────────────────┘

Después de login exitoso:
- Modal cierra
- Recarga página
- Muestra perfil en lugar de LOGIN button
```

### Estado 2: Autenticado

```
Ubicación: Esquina superior derecha
┌──────────────────────────────┐
│ 👤 JugadorPro123 ▼           │
│ Hover: Fondo #16213E         │
│ Click: Muestra dropdown       │
└──────────────────────────────┘

Dropdown Menu (Click):
┌──────────────────────────────┐
│ Ver Perfil                   │
├──────────────────────────────┤
│ Configuración                │
├──────────────────────────────┤
│ Mis Compras                  │
├──────────────────────────────┤
│ Cerrar Sesión               │
└──────────────────────────────┘

Tamaño avatar: 16x16px
Posición nombre: A la derecha avatar + 4px
Altura total: 32px
```

---

## ✅ Checklist Implementación

- [ ] Crear componente MainMenu.tsx
- [ ] Integrar Clerk para autenticación
- [ ] Botones con estados (normal, hover, pressed)
- [ ] Responsive design (mobile-first)
- [ ] Transiciones fade 200ms
- [ ] Footer con información
- [ ] Dark theme aplicado
- [ ] Testing en múltiples resoluciones

---

## 📝 Notas de Desarrollo

- **Framework:** TanStack Start + React
- **Estilos:** TailwindCSS + CSS custom properties
- **Animaciones:** CSS transitions 200ms ease-in-out
- **Tipografía:** PressStart2P o fallback monospace
- **Imágenes:** PNG 32x32, escaladas con `image-rendering: pixelated`
- **Accesibilidad:** Semantic HTML, ARIA labels, keyboard navigation

---

**Última revisión:** 26 de mayo de 2026  
**Aprobado por:** Equipo de Diseño  
**Listo para:** Implementación Frontend
