# 📋 Wireframes - Damas Game

**Última actualización:** 26 de mayo de 2026  
**Responsable:** Diseño UI/UX  
**Estado:** V1.0 - Prototipo  

---

## 📑 Índice de Wireframes

1. **[Menu Principal](./01-menu-principal.md)** - Pantalla inicial con opciones principales
2. **[Selección de Dificultad](./02-seleccion-dificultad.md)** - Elegir nivel antes de jugar
3. **[Pantalla de Juego](./03-pantalla-juego.md)** - Interfaz durante la partida
4. **[Rankings](./04-rankings.md)** - Tabla de posiciones
5. **[Tienda](./05-tienda.md)** - Compra de skins

---

## 🎨 Principios de Diseño

- ✅ **Retro Pixel Art:** 8-bit/16-bit inspired (ver DESIGN-PIXELART.SKILL.md)
- ✅ **Accesibilidad:** Botones grandes, texto legible
- ✅ **Responsive:** Funciona en mobile y desktop
- ✅ **Navegación Clara:** Fácil moverse entre pantallas
- ✅ **Feedback Visual:** Efectos hover y animaciones

---

## 📐 Especificaciones Técnicas

### Resoluciones Soportadas

| Dispositivo | Resolución | Escala |
|-------------|-----------|--------|
| Mobile | 320x568px | 1x |
| Tablet | 768x1024px | 1.5x |
| Desktop | 1024x768px | 2x |
| Desktop Full | 1440x900px | 2.25x |

### Unidades Base

- **Grid:** 8px (múltiplos de 8 para alineación)
- **Tipografía:** Ver DESIGN-PIXELART.SKILL.md
- **Colores:** Ver paleta en DESIGN-PIXELART.SKILL.md
- **Espaciado:** Múltiplos de 8px (8, 16, 24, 32, 40px)

---

## 🔐 Zonas de Autenticación

Estrategia de login ubicado estratégicamente:

### Ubicación:
**Esquina superior derecha** (respeta espacio de juego)

### Estados:

1. **No Autenticado:**
   - Botón: "LOGIN / SIGN UP"
   - Color: #67E8F9 (Cyan espacial)
   - Tamaño: 24px altura

2. **Autenticado:**
   - Muestra: Avatar (16x16) + Nombre usuario (8px)
   - Menú dropdown: Perfil, Logout
   - Color: #B0E0FF (Azul claro espacial)

### Flujo:
```
Click Login → Modal de Clerk → Redirecciona dashboard
```

---

## 🎯 Estructura de Navegación

```
┌─ MENU PRINCIPAL ─────────────────────┐
│  ┌─ LOGIN (esquina superior derecha) │
│  │                                   │
│  ├─ JUGAR ──→ SELECCIONAR DIFICULTAD│
│  │            ├─ Principiante       │
│  │            ├─ Intermedio         │
│  │            ├─ Master             │
│  │            └─ Ultra              │
│  │                ↓                  │
│  │            PANTALLA DE JUEGO      │
│  │                                   │
│  ├─ RANKING ────→ Tabla de scores   │
│  │                                   │
│  └─ TIENDA ─────→ Shop de Skins     │
└───────────────────────────────────────┘
```

---

## 📱 Componentes Reutilizables

### Botón Estándar (64x32px)

```
┌──────────────────┐
│  TEXTO BOTÓN     │
└──────────────────┘
Color: #FFD700 (Normal)
Hover: #67E8F9
Pressed: #C026D3
Borde: 2px relief 3D
```

### Panel (Fondo)

```
Color: #0B0D2B (Principal)
Borde: 2px #67E8F9
Sombra: 2px offset #000000 (50% opacity)
Padding: 16px
```

### Header (Encabezado)

```
Fondo: #1E2547
Fuente: 16px bold, #FFFFFF
Borde inferior: 2px #67E8F9
Alto: 40px
```

---

## 🔄 Transiciones

| Transición | Duración | Easing |
|-----------|----------|--------|
| Fade pantalla | 200ms | ease-in-out |
| Hover botón | 100ms | ease-out |
| Slide menú | 300ms | ease-in-out |
| Cambio pantalla | 250ms | ease-in-out |

---

## 📝 Especificaciones por Wireframe

Ver archivos individuales:

1. **01-menu-principal.md**
   - Botones: Jugar, Ranking, Tienda, Salir
   - Login en esquina superior derecha
   - Logo y título centrados
   - Altura: Variable, responsive

2. **02-seleccion-dificultad.md**
   - 4 opciones de dificultad
   - Descripción por nivel
   - Botón "Atrás"
   - Botón "Jugar"

3. **03-pantalla-juego.md**
   - Tablero 8x8 centrado
   - Panel de control derecho
   - Perfil/nombre arriba a la izquierda
   - Status bar abajo
   - Historial de movimientos

4. **04-rankings.md**
   - Tabla scrolleable
   - Top 10 destacados
   - Tu posición resaltada
   - Filtros por dificultad

5. **05-tienda.md**
   - Grid de skins
   - Cada card con imagen, nombre, precio
   - Botón comprar/descargado
   - Carrito (opcional)

---

## 🎨 Paleta de Colores

```
PRIMARIOS:
#0B0D2B (Espacio profundo - fondos)
#FFD700 (Dorado - botones principales)

SECUNDARIOS:
#0E1233 (Azul cósmico - panels)
#1E2547 (Visor espacial - contrast)

TEXTO:
#FFFFFF (Blanco - primario)
#B0E0FF (Azul claro espacial - secundario)

ACENTOS:
#FFD700 (Dorado - highlights)
#FF4D6B (Rojo - errores/delete)
```

---

## 📐 Espaciado Estándar

```
Separación entre elementos: 8px, 16px, 24px, 32px
Padding interior: 16px (estándar)
Margen exterior: 24px
Ancho máximo contenedor: 512px (en desktop escalado 2x)
```

---

## ✅ Checklist para Desarrollo

- [ ] Implementar componentes reutilizables
- [ ] Usar TanStack Router para navegación
- [ ] Integrar Clerk para autenticación
- [ ] Aplicar estilos del DESIGN-PIXELART.SKILL.md
- [ ] Responsive design (mobile-first)
- [ ] Testear en múltiples resoluciones
- [ ] Accesibilidad (WCAG 2.1 AA)
- [ ] Performance (Lighthouse > 90)

---

**Próxima revisión:** Después de implementación V1
**Contacto:** Equipo de desarrollo
