# 📊 Wireframe - Rankings

**Componente:** Tabla de Rankings  
**Versión:** 1.0  
**Responsable:** UI/UX Design  
**Estado:** ✅ Aprobado  

---

## 📐 Diagrama ASCII

```
┌──────────────────────────────────────────────────────────────┐
│                                              [LOGIN]          │
│ ◄ ATRÁS                                                       │
│                                                              │
│ 📊 RANKINGS - TOP 10                                         │ ← Título
│                                                              │
│ Filtro: [Todos] [Principiante] [Intermedio] [Master] [Ultra]│
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ #  │ Jugador       │ Puntos  │ Victorias │ Win Rate   │  │
│ ├────┼───────────────┼─────────┼───────────┼────────────┤  │
│ │ 1️⃣  │ ProPlayer99   │  5200   │    89     │  78.3%    │  │ ← Oro
│ │ 2️⃣  │ MasterMind    │  4850   │    82     │  76.5%    │  │ ← Plata
│ │ 3️⃣  │ ChampionKing  │  4650   │    77     │  74.2%    │  │ ← Bronce
│ │ 4   │ IceFreeze     │  4320   │    71     │  71.9%    │  │
│ │ 5   │ SilentForce   │  4100   │    68     │  69.4%    │  │
│ │ 6   │ FireStorm     │  3950   │    65     │  68.1%    │  │
│ │ 7   │ ShadowLeader  │  3820   │    62     │  66.7%    │  │
│ │ 8   │ VoidKnight    │  3650   │    59     │  64.5%    │  │
│ │ 9   │ ZenMaster123  │  3500   │    56     │  62.3%    │  │
│ │ 10  │ LunaStrike    │  3320   │    53     │  60.1%    │  │
│ ├────┼───────────────┼─────────┼───────────┼────────────┤  │
│ │ 42  │ TuJugador ⭐  │  1450   │    22     │  45.2%    │  │ ← Tu posición
│ │     │ (Tu posición) │         │           │            │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ Últimas partidas del Top 1:                                 │
│ • Ganó vs Master (26/05 - 4:32)                            │
│ • Ganó vs Master (25/05 - 5:12)                            │
│ • Empató vs Master (24/05 - 3:45)                          │
│                                                              │
│ [Actualizar] [Compartir] [Volver]                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎯 Componentes Principales

### Filtros
```
Filtro por dificultad:
[Todos] [Principiante] [Intermedio] [Master] [Ultra]

Estilos:
- Tab activo: #33AA33 borde inferior 2px
- Tab normal: #999999
- Hover: #CCCCCC
- Transición: 100ms ease
```

### Tabla Rankings

```
Columnas:
1. # (2 caracteres ancho)
2. Jugador (nombre, truncado)
3. Puntos (5 dígitos)
4. Victorias (3 dígitos)
5. Win Rate (5 caracteres, ej: 78.3%)

Medallas (Top 3):
- #1: 🥇 Oro
- #2: 🥈 Plata  
- #3: 🥉 Bronce

Fila del jugador:
- Highlight: Fondo #0F3460 + borde izquierdo 3px #FFAA00
- Etiqueta: ⭐ "Tu posición"

Rows altura: 32px
Separación rows: Grid lines 1px #333333
```

---

## ✅ Componentes Menores

- [ ] Crear tabla scrolleable
- [ ] Integrar filtros por dificultad
- [ ] Resaltar posición del jugador
- [ ] Medallas para Top 3
- [ ] Información del Top 1

---

**Última revisión:** 26 de mayo de 2026  
**Listo para:** Implementación
