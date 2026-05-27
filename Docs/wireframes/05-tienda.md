# 🛍️ Wireframe - Tienda

**Componente:** Shop de Skins  
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
│ 🛍️  TIENDA - CUSTOMIZA TU JUEGO                             │ ← Título
│                                                              │
│ Filtro: [Todos] [Fichas] [Tableros] [Paquetes]             │
│ Orden: [Nuevos] [Populares] [Precio ↓]                     │
│                                                              │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ │          │ │          │ │          │ │          │        │
│ │ 🎨 Image │ │ 🎨 Image │ │ 🎨 Image │ │ 🎨 Image │        │
│ │          │ │          │ │          │ │          │        │
│ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤        │
│ │ Cyber    │ │ Gold     │ │ Neo-Dark │ │ Retro    │        │
│ │ Pieces   │ │ Pieces   │ │ Board    │ │ Pack     │        │
│ │          │ │          │ │          │ │          │        │
│ │ $4.99    │ │ $3.99    │ │ $5.99    │ │ $9.99    │        │
│ │ RARE     │ │ COMMON   │ │ EPIC     │ │ BUNDLE   │        │
│ │          │ │          │ │          │ │          │        │
│ │ [Comprar]│ │ [✓ Obten]│ │ [Comprar]│ │ [Comprar]│        │
│ │ or [View]│ │ [Ver]    │ │ or [View]│ │ or [View]│        │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                              │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ │          │ │          │ │          │ │          │        │
│ │ 🎨 Image │ │ 🎨 Image │ │ 🎨 Image │ │ 🎨 Image │        │
│ │          │ │          │ │          │ │          │        │
│ └──────────┴─┴──────────┴─┴──────────┴─┴──────────┘        │
│                                                              │
│ [Página 1 de 3]  ← Pagination                              │
│ [◀ Anterior] [1] [2] [3] [Siguiente ▶]                    │
│                                                              │
│ Carrito: 2 items  [💳 Pagar $12.98]                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎯 Card de Producto

```
DIMENSIONES CARD:
Ancho: 140px
Alto: 200px
Separación: 16px (grid gap)

ESTRUCTURA CARD:
┌────────────────┐
│                │ ← Imagen 140x100px
│  [Imagen]      │   (Miniatura animada)
│                │
├────────────────┤
│ Cyber Pieces   │ ← Nombre 12px bold
│                │
│ RARE           │ ← Rareza badge
│ ⭐⭐⭐         │ ← Calificación (opcional)
│                │
│ $4.99          │ ← Precio 14px bold
│                │
│ [Comprar]      │ ← Botón 100% ancho
│  or [Ver]      │
└────────────────┘

COLORES RAREZA:
- COMMON: #999999 (Gris)
- UNCOMMON: #33AA33 (Verde)
- RARE: #4444FF (Azul)
- EPIC: #FFAA00 (Naranja/Oro)
- LEGENDARY: #FF4444 (Rojo)
```

---

## ✅ Checklist Implementación

- [ ] Grid de skins responsive
- [ ] Filtros por tipo y rareza
- [ ] Ordenamiento dinámico
- [ ] Carrito de compras
- [ ] Integración Stripe
- [ ] Paginación
- [ ] Vista detallada de skin

---

**Última revisión:** 26 de mayo de 2026  
**Listo para:** Implementación
