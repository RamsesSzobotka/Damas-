# 🎯 Wireframe - Selección de Dificultad

**Componente:** Selección Dificultad  
**Versión:** 1.0  
**Responsable:** UI/UX Design  
**Estado:** ✅ Aprobado  

---

## 📐 Diagrama ASCII

```
┌────────────────────────────────────────────────────────────────┐
│                                          ┌──────────────────┐  │
│                                          │  [LOGIN/PROFILE] │  │ ← Auth Button
│                                          └──────────────────┘  │
│                                                                 │
│                                                                 │
│                    ◄ ATRÁS                                      │ ← Back button
│                                                                 │
│                   ELIGE DIFICULTAD                             │ ← Título
│                                                                 │
│                                                                 │
│        ┌──────────────────────────────────────┐                │
│        │                                      │                │
│        │    ┌────────────────────────┐        │                │
│        │    │     🟢 PRINCIPIANTE    │        │                │
│        │    │                        │        │                │
│        │    │ "Perfecto para         │        │                │
│        │    │  aprender las reglas"  │        │                │
│        │    │                        │        │                │
│        │    │ Profundidad: 1-2       │        │                │
│        │    └────────────────────────┘        │                │
│        │                                      │                │
│        │    ┌────────────────────────┐        │                │
│        │    │    🟡 INTERMEDIO       │        │                │
│        │    │                        │        │                │
│        │    │ "Desafío moderado      │        │                │
│        │    │  para jugadores"       │        │                │
│        │    │                        │        │                │
│        │    │ Profundidad: 3-4       │        │                │
│        │    └────────────────────────┘        │                │
│        │                                      │                │
│        │    ┌────────────────────────┐        │                │
│        │    │     🔴 MASTER          │        │                │
│        │    │                        │        │                │
│        │    │ "Experto, muy difícil" │        │                │
│        │    │                        │        │                │
│        │    │ Profundidad: 5-6       │        │                │
│        │    └────────────────────────┘        │                │
│        │                                      │                │
│        │    ┌────────────────────────┐        │                │
│        │    │     ⚫ ULTRA           │        │                │
│        │    │                        │        │                │
│        │    │ "Casi imposible,       │        │                │
│        │    │  ¿eres capaz?"        │        │                │
│        │    │                        │        │                │
│        │    │ Profundidad: 7+        │        │                │
│        │    └────────────────────────┘        │                │
│        │                                      │                │
│        └──────────────────────────────────────┘                │
│                                                                 │
│                                                                 │
│                 ┌──────────────────┐                           │
│                 │   [JUGAR]        │ ← Botón verde principal  │
│                 └──────────────────┘                           │
│                                                                 │
│                 ┌──────────────────┐                           │
│                 │   [ATRÁS]        │ ← Botón rojo secundario  │
│                 └──────────────────┘                           │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Zonas y Dimensiones

### Header - Navegación

```
┌────────────────────────────────────┐
│  ◄ ATRÁS  (16px, texto interactivo)│
│  (alineado izquierda, padding 16px)│
│                                    │
│  Color: #B0E0FF                    │
│  Hover: #67E8F9 (cyan)             │
│  Cursor: pointer                   │
│  Font: 10px, monospace bold        │
└────────────────────────────────────┘
```

### Título Principal

```
┌────────────────────────────────────┐
│                                    │
│     ELIGE DIFICULTAD               │ ← Título 20px bold
│                                    │
│     (Opcional: descripción breve)  │
│     "Selecciona tu nivel de desafío│
│                                    │
│      Tiempo respuesta IA varía)    │
│                                    │
└────────────────────────────────────┘

Font: 20px bold, #FFFFFF
Subtitle: 10px, #B0E0FF
Padding: 24px vertical
```

---

### Área Principal - Tarjetas de Dificultad

```
┌──────────────────────────────────────────────┐
│  GRID DE 4 TARJETAS (2x2 en desktop)        │
│  Cada tarjeta: 240px × 140px                │
│  Separación: 16px entre tarjetas             │
│                                              │
│  TARJETA 1: PRINCIPIANTE                    │
│  ┌────────────────────────────────┐         │
│  │ 🟢                             │         │
│  │ PRINCIPIANTE                   │         │
│  │                                │         │
│  │ "Perfecto para aprender"       │         │
│  │                                │         │
│  │ Profundidad búsqueda: 1-2      │         │
│  │ Tiempo respuesta: <100ms       │         │
│  │                                │         │
│  │ ► Jugar                        │         │
│  └────────────────────────────────┘         │
│                                              │
│  TARJETA 2: INTERMEDIO                      │
│  ┌────────────────────────────────┐         │
│  │ 🟡                             │         │
│  │ INTERMEDIO                     │         │
│  │                                │         │
│  │ "Desafío moderado"             │         │
│  │                                │         │
│  │ Profundidad búsqueda: 3-4      │         │
│  │ Tiempo respuesta: <200ms       │         │
│  │                                │         │
│  │ ► Jugar                        │         │
│  └────────────────────────────────┘         │
│                                              │
│  TARJETA 3: MASTER                          │
│  ┌────────────────────────────────┐         │
│  │ 🔴                             │         │
│  │ MASTER                         │         │
│  │                                │         │
│  │ "Experto, muy difícil"         │         │
│  │                                │         │
│  │ Profundidad búsqueda: 5-6      │         │
│  │ Tiempo respuesta: <500ms       │         │
│  │                                │         │
│  │ ► Jugar                        │         │
│  └────────────────────────────────┘         │
│                                              │
│  TARJETA 4: ULTRA                           │
│  ┌────────────────────────────────┐         │
│  │ ⚫                             │         │
│  │ ULTRA                          │         │
│  │                                │         │
│  │ "¿Eres capaz de ganar?"        │         │
│  │                                │         │
│  │ Profundidad búsqueda: 7+       │         │
│  │ Tiempo respuesta: <1s          │         │
│  │                                │         │
│  │ ► Jugar                        │         │
│  └────────────────────────────────┘         │
│                                              │
└──────────────────────────────────────────────┘

ESTILOS TARJETA:
Normal:
  - Fondo: #1E2547 (visor espacial)
  - Borde: 2px #67E8F9 (cyan)
  - Padding: 12px
  
Hover:
  - Fondo: #0E1233 (+brillo)
  - Borde: 2px #FFD700 (dorado)
  - Transform: scale(1.02)
  - Cursor: pointer
  
Seleccionada:
  - Borde: 3px #FFD700 (dorado brillante)
  - Box-shadow: 0 0 8px #67E8F9 (resplandor)

CONTENIDO TARJETA:
┌─────────────────────┐
│ Icono emoji: 48px   │ ← Centered
│ (🟢 🟡 🔴 ⚫)       │
├─────────────────────┤
│ Nombre: 14px bold   │ ← Bold
│ #FFFFFF             │
├─────────────────────┤
│ Descripción: 10px   │ ← Gris claro
│ "Subtítulo..."      │
├─────────────────────┤
│ Info técnica: 8px   │ ← Gris oscuro
│ Profundidad: N      │
│ Tiempo: Xms         │
├─────────────────────┤
│ Botón: "► Jugar"    │ ← Verde hover
│ 12px, interactivo   │
└─────────────────────┘
```

---

## 🎨 Especificaciones de Color por Dificultad

### Principiante 🟢
```
Color primario: #67E8F9 (Cyan)
Color secundario: #B0E0FF (Azul claro)
Icono: 🟢
Borde: #67E8F9
Hover border: #B0E0FF
```

### Intermedio 🟡
```
Color primario: #FFD700 (Dorado)
Color secundario: #FFF1A8 (Dorado claro)
Icono: 🟡
Borde: #FFD700
Hover border: #67E8F9
```

### Master 🔴
```
Color primario: #C026D3 (Magenta)
Color secundario: #E879F9 (Magenta claro)
Icono: 🔴
Borde: #C026D3
Hover border: #FF4D6B
```

### Ultra ⚫
```
Color primario: #F0F8FF (Blanco estelar)
Color secundario: #B0E0FF (Azul claro)
Icono: ⚫
Borde: #F0F8FF
Hover border: #67E8F9
```

---

## 🔘 Botones de Acción

### Botón "JUGAR" (Principal)

```
┌──────────────────────┐
│  [JUGAR]             │
│  200px × 40px        │
│  Font: 14px bold     │
│  Color: #FFD700      │
│  Hover: #67E8F9      │
│  Pressed: #C026D3    │
└──────────────────────┘

Ubicación: Centro inferior
Acciones:
1. Validar dificultad seleccionada
2. Si no hay selección → mostrar error
3. Si hay selección → cargar juego
4. Fade out 200ms
5. Cargar pantalla juego
```

### Botón "ATRÁS" (Secundario)

```
┌──────────────────────┐
│  [ATRÁS]             │
│  200px × 40px        │
│  Font: 14px bold     │
│  Color: #FF4D6B      │
│  Hover: #E879F9      │
│  Pressed: #B91C3C    │
└──────────────────────┘

Ubicación: Centro inferior, debajo de "JUGAR"
Separación: 12px
Acciones:
1. Fade out 200ms
2. Cargar pantalla anterior (Menu Principal)
3. Fade in 200ms
4. Focus automático en botón "JUGAR"
```

---

## 📐 Layout Responsivo

### Móvil (320px - 480px)

```
┌────────────────────┐
│ [LOGIN]            │
│ ◄ ATRÁS            │
│                    │
│ ELIGE DIFICULTAD   │
│ (descripción)      │
│                    │
│ (SCROLL VERTICAL)  │
│ ┌──────────────┐   │
│ │ 🟢 PRINCIPIANTE │   │
│ │ Description... │   │
│ │ ► Jugar      │   │
│ └──────────────┘   │
│                    │
│ ┌──────────────┐   │
│ │ 🟡 INTERMEDIO │   │
│ │ Description... │   │
│ │ ► Jugar      │   │
│ └──────────────┘   │
│                    │
│ ┌──────────────┐   │
│ │ 🔴 MASTER    │   │
│ │ Description... │   │
│ │ ► Jugar      │   │
│ └──────────────┘   │
│                    │
│ ┌──────────────┐   │
│ │ ⚫ ULTRA     │   │
│ │ Description... │   │
│ │ ► Jugar      │   │
│ └──────────────┘   │
│                    │
│ ┌──────────────┐   │
│ │  [JUGAR]     │   │
│ └──────────────┘   │
│ ┌──────────────┐   │
│ │  [ATRÁS]     │   │
│ └──────────────┘   │
│                    │
└────────────────────┘

Layout: 1 columna
Tarjeta ancho: 100% - 24px padding
Alto tarjeta: 120px
Scroll: Vertical (si necesario)
```

### Tablet (768px - 1024px)

```
┌────────────────────────────┐
│ [LOGIN]                    │
│ ◄ ATRÁS                    │
│                            │
│ ELIGE DIFICULTAD           │
│ (descripción)              │
│                            │
│ ┌──────────┐ ┌──────────┐ │
│ │🟢 PRINC..│ │🟡 INTER..│ │
│ │Desc...   │ │Desc...   │ │
│ │► Jugar   │ │► Jugar   │ │
│ └──────────┘ └──────────┘ │
│                            │
│ ┌──────────┐ ┌──────────┐ │
│ │🔴 MASTER │ │⚫ ULTRA  │ │
│ │Desc...   │ │Desc...   │ │
│ │► Jugar   │ │► Jugar   │ │
│ └──────────┘ └──────────┘ │
│                            │
│ ┌──────────────────────┐   │
│ │  [JUGAR]             │   │
│ └──────────────────────┘   │
│ ┌──────────────────────┐   │
│ │  [ATRÁS]             │   │
│ └──────────────────────┘   │
│                            │
└────────────────────────────┘

Layout: 2 columnas
Tarjeta ancho: 240px
Separación: 16px
```

### Desktop (1024px+)

```
┌────────────────────────────────────┐
│ [LOGIN]                            │
│ ◄ ATRÁS                            │
│                                    │
│ ELIGE DIFICULTAD                   │
│ (descripción detallada)            │
│                                    │
│ ┌──────────┐ ┌──────────┐          │
│ │🟢 PRINC..│ │🟡 INTER..│          │
│ │Desc...   │ │Desc...   │          │
│ │► Jugar   │ │► Jugar   │          │
│ └──────────┘ └──────────┘          │
│                                    │
│ ┌──────────┐ ┌──────────┐          │
│ │🔴 MASTER │ │⚫ ULTRA  │          │
│ │Desc...   │ │Desc...   │          │
│ │► Jugar   │ │► Jugar   │          │
│ └──────────┘ └──────────┘          │
│                                    │
│            ┌──────────────────┐    │
│            │  [JUGAR]         │    │
│            └──────────────────┘    │
│            ┌──────────────────┐    │
│            │  [ATRÁS]         │    │
│            └──────────────────┘    │
│                                    │
└────────────────────────────────────┘

Layout: 2x2 grid
Tarjeta ancho: 240px
Separación: 24px
Centro horizontal: Flex
```

---

## ✨ Interacciones

### Seleccionar Dificultad

```
Estado 1: Ninguna seleccionada
- Todas las tarjetas con borde normal
- Botón "JUGAR" deshabilitado (gris)

Click tarjeta:
- Animación: scale 1.00 → 1.02 (100ms)
- Borde: #67E8F9 → #FFD700
- Glow: Aparece sombra dorada
- Otras tarjetas: mantienen estado normal

Estado 2: Seleccionada
- Borde: 3px #FFD700
- Glow: 0 0 8px #67E8F9
- Botón "JUGAR": Activo (dorado)
- Hover otros botones: Deshabilitados
```

### Navegar

```
Click "JUGAR":
1. Validar: ¿Hay dificultad seleccionada?
   - SI: Continuar
   - NO: Mostrar tooltip "Selecciona una dificultad"
2. Fade out 200ms
3. Cargar juego (backend request)
4. Fade in 200ms
5. Mostrar pantalla juego

Click "ATRÁS":
1. Fade out 200ms
2. Cargar menu principal
3. Fade in 200ms
4. Focus: Botón "JUGAR"

Click "◄ ATRÁS" (header):
- Mismo comportamiento que botón ATRÁS
```

---

## 🎨 Efectos Visuales

```
Animación selección: 100ms ease-out
Fade entre pantallas: 200ms ease-in-out
Hover tarjeta: 50ms ease-out
Glow efecto: Box-shadow suave

Sonidos (opcional):
- Hover tarjeta: "beep" suave
- Click tarjeta: "pop" retro
- Click botón: "click" retro
```

---

## ✅ Checklist Implementación

- [ ] Crear componente DifficultySelector.tsx
- [ ] Tarjetas con estados (normal, hover, selected)
- [ ] Botones JUGAR/ATRÁS funcionales
- [ ] Validación de selección
- [ ] Transiciones fade 200ms
- [ ] Responsive design (2x2 en desktop, 1x en mobile)
- [ ] Iconos emoji o SVG
- [ ] Testing en múltiples resoluciones

---

**Última revisión:** 26 de mayo de 2026  
**Aprobado por:** Equipo de Diseño  
**Listo para:** Implementación Frontend
