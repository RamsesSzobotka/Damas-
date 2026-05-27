Skill.md - Diseño de Interfaz (UI/UX)
Juego: Damas (Checkers) — Player vs Machine
Nombre del Proyecto: [Damas Pixel]
Versión: 1.1
Fecha: 27 de mayo de 2026
Estilo objetivo: Inspirado en Pokémon Ruby (GBA): interfaz retro-modernizada, limpieza, claridad y estética pixel art fuerte.

1. Paleta de Colores Principal (Estética Ruby)



























































UsoColor HexRGBUsoFondo principal#0A1F3D10,31,61Fondo oscuro estilo GBAAcento principal#E31C2B227,28,43Rojo RubyAcento secundario#FFD700255,215,0Dorado (resaltes y highlights)Texto principal#FFFFFF255,255,255BlancoTexto secundario#B0C8E0176,200,224Azul claroColor Jugador 1 (Rojo)#E31C2B227,28,43Fichas rojasColor Jugador 2 (Blanco)#F0F0F0240,240,240Fichas blancas / doradasFondo de botones#1E3A6B30,58,107Paneles y controles
Tipografía (Pixel Art):

Principal: Press Start 2P o Pokemon GB (pixel art)
Títulos y encabezados: Press Start 2P Bold
Textos pequeños / log: VT323 o fuente pixel art similar
Todas las fuentes deben mantener fuerte estética pixel art con tamaño adecuado para legibilidad en resoluciones bajas.

Fondos: Imágenes estáticas o animaciones sutiles en bucle con estética GBA (tablero de madera envejecida, patrones retro).

2. Resolución Recomendada

Nativa: 1280×720 (16:9) o 1920×1080
Estilo visual: Tablero central con estética pixel art grande y limpia. UI con marcos y ventanas tipo GBA. Todo escalado manteniendo proporciones retro.


3. Flujo de Pantallas
3.1 Pantalla Inicial (Title Screen)

Fondo: imagen retro de tablero de damas con estilo GBA
Logo grande del juego en la parte superior (título en pixel art)
Botón principal: JUGAR (con resalte dorado)
Opciones pequeñas: Créditos / Opciones / Salir

3.2 Menú Principal

Opciones claras:
Nueva Partida (vs Máquina)
Dificultad (Fácil / Medio / Difícil / Experto)
Cómo Jugar (reglas)
Pokédex → reemplazado por Galería de Tableros o Estadísticas


3.3 Pantalla de Juego (Tablero Principal)
Layout Principal:

Tablero de Damas centrado y grande (8x8) con estilo pixel art y bordes retro
Fichas grandes y bien visibles (rojas vs blancas/doradas)
Indicador de turno prominente en la parte superior
Información de jugadores:
Izquierda: Tú (Rojo) — Nombre + capturas
Derecha: Máquina (Blanco) — Nombre + capturas + nivel de dificultad

Barra de estado con mensaje grande (ej: "Tu turno", "Máquina pensando...")
Panel inferior derecho: Botones de acción
Sugerir Movimiento (opcional)
Deshacer (si está permitido)
Rendirse
Menú


Elementos clave:

Animaciones suaves de movimiento de fichas (salto con arco)
Efecto de "coronación" destacado con brillo dorado
Capturas con animación de eliminación
Resaltado de casillas válidas (brillo suave dorado)
Log de movimientos en lateral o inferior (estilo caja de diálogo GBA)

3.4 Pantalla de Victoria / Derrota

Pantalla completa con fondo oscurecido
Texto grande pixel art:
¡VICTORIA! (con confeti sutil dorado)
DERROTA (efecto más oscuro)

Estadísticas de la partida (fichas capturadas, tiempo, etc.)
Botones: Revancha / Menú Principal

3.5 Opciones de Dificultad

Selección visual de niveles con iconos pixel art
Descripción breve de cada dificultad
Vista previa del tablero


4. Componentes UI Reutilizables

Caja de diálogo / Log: Marco con borde dorado, fondo semitransparente oscuro
Botones: Rectángulos con borde sutil, hover con brillo dorado
Cursor/Selector: Indicador pixelado (flecha o marco brillante)
Tablero: Casillas alternas claras/oscuras con textura sutil de madera retro
Fichas: Diseño pixel art grande y reconocible (con corona diferenciada)
Timer: Opcional (rectangular con cuenta regresiva clara)


5. Animaciones y Feedback

Transiciones suaves entre pantallas (fade, slide)
Hover en botones: leve escalado + brillo dorado
Movimiento de fichas: animación fluida con sonido retro
Salto/captura: efecto de arco + partícula de eliminación
Coronación: flash dorado + sonido distintivo
"Máquina pensando...": animación de puntos o reloj pixelado
Victoria/Derrota: animación moderada (confeti dorado o efecto oscuro)


6. Assets Necesarios

Tablero 8x8 con estilo pixel art / GBA
Fichas rojas y blancas (normales + coronadas)
Fondos retro para Title, Menú y Pantalla de Juego
Iconos pixel art (corona, trofeo, rendición)
Efectos de sonido cortos (movimiento, captura, victoria, derrota)
Fuentes pixel art confirmadas (Press Start 2P + VT323)


Notas del diseñador:
El diseño mantiene la estética retro GBA / Pokémon Ruby pero adaptada completamente a Damas. Prioriza claridad en el tablero, legibilidad de texto pixel art y feedback visual satisfactorio. Todo está orientado a Player vs Machine, sin elementos multijugador. No añadir mecánicas complejas fuera de las reglas clásicas de Damas.