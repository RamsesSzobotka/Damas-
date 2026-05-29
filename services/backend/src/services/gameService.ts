/**
 * Game Service
 * 
 * Orquesta la lógica de juego de damas.
 * Se comunica con el servicio de IA para calcular movimientos
 * y persiste el estado del juego en MongoDB.
 */

import { ObjectId } from 'mongodb'
import { getDatabase } from '@/database/Database'
import { GAME_COLLECTION } from '@/models/Game'
import type { Game } from '@/models/Game'
import { calculateMove } from '@/services/iaClient'
import { BOARD_SIZE } from '@/types/enums'

/**
 * Verifica si un jugador tiene al menos un movimiento válido en el tablero.
 * Busca movimientos simples y capturas para todas las fichas del jugador.
 */
function hasValidMoves(board: number[][], isPlayerSide: boolean): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c]
      if (piece === 0) continue

      const isPlayerPiece = piece === 1 || piece === 3
      if (isPlayerPiece !== isPlayerSide) continue

      const isKing = piece === 3 || piece === 4

      const directions: [number, number][] = []
      if (isKing || isPlayerSide) {
        directions.push([-1, -1], [-1, 1])
      }
      if (isKing || !isPlayerSide) {
        directions.push([1, -1], [1, 1])
      }

      for (const [dr, dc] of directions) {
        if (isKing) {
          let enemySeen = false
          for (let step = 1; ; step++) {
            const sr = r + dr * step
            const sc = c + dc * step
            if (sr < 0 || sr >= BOARD_SIZE || sc < 0 || sc >= BOARD_SIZE) break

            const cell = board[sr][sc]

            if (!enemySeen) {
              if (cell === 0) return true // simple move
              const isSelf = isPlayerSide
                ? (cell === 1 || cell === 3)
                : (cell === 2 || cell === 4)
              if (isSelf) break
              enemySeen = true // found enemy, can capture beyond it
              continue
            }

            if (cell !== 0) break
            return true // can capture here
          }
        } else {
          const nr = r + dr
          const nc = c + dc
          if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) continue

          if (board[nr][nc] === 0) return true // simple move

          // Check capture
          const cr = r + 2 * dr
          const cc = c + 2 * dc
          if (cr < 0 || cr >= BOARD_SIZE || cc < 0 || cc >= BOARD_SIZE) continue

          const isOpponent = isPlayerSide
            ? (board[nr][nc] === 2 || board[nr][nc] === 4)
            : (board[nr][nc] === 1 || board[nr][nc] === 3)

          if (isOpponent && board[cr][cc] === 0) return true
        }
      }
    }
  }
  return false
}

/**
 * Crea un tablero inicial de damas 8×8 con la disposición estándar:
 * - Filas 0-2: fichas de la IA (valor 2)
 * - Filas 5-7: fichas del jugador (valor 1)
 * - Solo en casillas oscuras ((r + c) % 2 !== 0)
 */
function createInitialBoard(): number[][] {
  const board: number[][] = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(0)
  )
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if ((r + c) % 2 !== 0) {
        // dark squares only
        if (r < 3) board[r][c] = 2 // AI pieces
        else if (r > 4) board[r][c] = 1 // Player pieces
      }
    }
  }
  return board
}

/**
 * Encuentra la ficha capturada (si existe) en un movimiento de `from` a `to`.
 * Camina casilla por casilla en la diagonal y devuelve la primera ficha
 * que no sea vacía. Funciona para fichas normales (2 pasos) y reyes (N pasos).
 */
function findCapturedPiece(
  board: number[][],
  from: [number, number],
  to: [number, number]
): [number, number] | null {
  const dr = to[0] > from[0] ? 1 : -1
  const dc = to[1] > from[1] ? 1 : -1
  const steps = Math.abs(to[0] - from[0])

  for (let s = 1; s < steps; s++) {
    const row = from[0] + s * dr
    const col = from[1] + s * dc
    if (board[row][col] !== 0) {
      return [row, col]
    }
  }
  return null
}

/**
 * Aplica un movimiento al tablero (optimistamente, sin validación de reglas).
 * - Mueve la ficha desde `from` a `to`
 * - Elimina las fichas capturadas (si se proporcionan explícitamente)
 * - Detecta promociones a rey
 */
function applyMoveToBoard(
  board: number[][],
  from: [number, number],
  to: [number, number],
  capturedPieces: [number, number][] = []
): number[][] {
  const newBoard = board.map((row) => [...row])
  const piece = newBoard[from[0]][from[1]]
  newBoard[from[0]][from[1]] = 0
  newBoard[to[0]][to[1]] = piece

  if (capturedPieces.length > 0) {
    for (const [capturedRow, capturedCol] of capturedPieces) {
      newBoard[capturedRow][capturedCol] = 0
    }
  } else {
    // Fallback: caminar la diagonal from→to y eliminar la primera ficha que no sea vacía
    const dr = to[0] > from[0] ? 1 : -1
    const dc = to[1] > from[1] ? 1 : -1
    const steps = Math.abs(to[0] - from[0])
    for (let s = 1; s < steps; s++) {
      const row = from[0] + s * dr
      const col = from[1] + s * dc
      if (newBoard[row][col] !== 0) {
        newBoard[row][col] = 0
        break
      }
    }
  }

  // Detectar promoción
  if (piece === 1 && to[0] === 0) newBoard[to[0]][to[1]] = 3 // Player king
  if (piece === 2 && to[0] === 7) newBoard[to[0]][to[1]] = 4 // AI king

  return newBoard
}

/**
 * Crea una nueva partida con tablero inicial y dificultad especificada.
 * @param difficulty - Dificultad de la partida
 * @param playerSkinId - ID de la skin equipada del jugador (opcional)
 * @returns gameId y tablero inicial
 */
export async function createGame(
  difficulty: string,
  playerSkinId?: string
): Promise<{ gameId: string; board: number[][] }> {
  const board = createInitialBoard()

  const game: Record<string, unknown> = {
    _id: new ObjectId(),
    userId: new ObjectId(), // Placeholder para partidas anónimas (V1)
    difficulty,
    status: 'active' as const,
    currentPlayer: 1,
    board,
    moves: [],
    totalMoves: 0,
    playerMoves: 0,
    aiMoves: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  if (playerSkinId) {
    game.playerSkinId = new ObjectId(playerSkinId)
  }

  const collection = getDatabase().getCollection(GAME_COLLECTION)
  await collection.insertOne(game)

  return { gameId: game._id.toHexString(), board }
}

/**
 * Obtiene una partida por su ID.
 * @param gameId - ID de la partida
 * @returns La partida o null si no existe
 */
export async function getGame(gameId: string): Promise<Game | null> {
  const collection = getDatabase().getCollection(GAME_COLLECTION)
  const game = await collection.findOne({ _id: new ObjectId(gameId) })
  return game as Game | null
}

/**
 * Procesa el movimiento de un jugador.
 * 1. Valida que la partida exista y esté activa
 * 2. Aplica el movimiento al tablero
 * 3. Solicita respuesta a la IA
 * 4. Aplica el movimiento de la IA
 * 5. Guarda todo en MongoDB
 * 6. Detecta fin de partida
 *
 * @param gameId - ID de la partida
 * @param from - Coordenada origen [fila, columna]
 * @param to - Coordenada destino [fila, columna]
 * @returns Estado actualizado del tablero y movimientos realizados
 */
export async function handlePlayerMove(
  gameId: string,
  from: [number, number],
  to: [number, number]
): Promise<{
  board: number[][]
  lastMove: { from: [number, number]; to: [number, number]; player: string }
  gameOver?: boolean
  result?: string
  nextPlayer?: number
  forcedPiece?: [number, number]
  aiMove?: { from: [number, number]; to: [number, number] }
}> {
  const collection = getDatabase().getCollection(GAME_COLLECTION)
  const game = await collection.findOne({ _id: new ObjectId(gameId) })

  if (!game) {
    throw new Error('Game not found')
  }

  if (game.status !== 'active') {
    throw new Error('Game is not active')
  }

  // Validar que sea el turno del jugador
  if (game.currentPlayer !== 1) {
    throw new Error('Not your turn')
  }

  // Aplicar movimiento del jugador
  const movedPiece = game.board[from[0]][from[1]]
  const captured = findCapturedPiece(game.board as number[][], from, to)
  const isCapture = captured !== null
  let currentBoard = applyMoveToBoard(
    game.board as number[][],
    from,
    to,
    captured ? [captured] : []
  )
  const pieceAfterMove = currentBoard[to[0]][to[1]]

  const canContinueCapture = (board: number[][], row: number, col: number): boolean => {
    const piece = board[row][col]
    if (piece === 0) return false

    const isKing = piece === 3 || piece === 4
    const isPlayerPiece = piece === 1 || piece === 3
    const directions: [number, number][] = []

    if (isKing || isPlayerPiece) {
      directions.push([-1, -1], [-1, 1])
    }
    if (isKing || piece === 2 || piece === 4) {
      directions.push([1, -1], [1, 1])
    }

    const isSameSide = (otherPiece: number): boolean => {
      if (piece === 1 || piece === 3) {
        return otherPiece === 1 || otherPiece === 3
      }

      return otherPiece === 2 || otherPiece === 4
    }

    for (const [dr, dc] of directions) {
      if (isKing) {
        let enemySeen = false

        for (let step = 1; ; step++) {
          const scanRow = row + step * dr
          const scanCol = col + step * dc

          if (
            scanRow < 0 ||
            scanRow >= BOARD_SIZE ||
            scanCol < 0 ||
            scanCol >= BOARD_SIZE
          ) {
            break
          }

          const cell = board[scanRow][scanCol]

          if (!enemySeen) {
            if (cell === 0) continue
            if (isSameSide(cell)) break

            enemySeen = true
            continue
          }

          if (cell !== 0) break

          return true
        }
      } else {
        const enemyRow = row + dr
        const enemyCol = col + dc
        const landRow = row + 2 * dr
        const landCol = col + 2 * dc

        if (
          enemyRow >= 0 &&
          enemyRow < BOARD_SIZE &&
          enemyCol >= 0 &&
          enemyCol < BOARD_SIZE &&
          landRow >= 0 &&
          landRow < BOARD_SIZE &&
          landCol >= 0 &&
          landCol < BOARD_SIZE
        ) {
          const enemyPiece = board[enemyRow][enemyCol]
          const landingPiece = board[landRow][landCol]

          if (!isSameSide(enemyPiece) && enemyPiece !== 0 && landingPiece === 0) {
            return true
          }
        }
      }
    }

    return false
  }

  // Registrar movimiento del jugador
  const playerMoveRecord = {
    from: [from[0], from[1]],
    to: [to[0], to[1]],
    movedAt: new Date(),
  }

  const playerCanContinue = isCapture && canContinueCapture(currentBoard, to[0], to[1])

  if (playerCanContinue) {
    const gameOverCheck = await checkGameOver(currentBoard)

    const $set: Record<string, unknown> = {
      board: currentBoard,
      currentPlayer: 1,
      updatedAt: new Date(),
    }

    const $inc: Record<string, number> = {
      totalMoves: 1,
      playerMoves: 1,
    }

    if (gameOverCheck.over) {
      $set.status = 'completed'
      $set.result = gameOverCheck.winner === 'player' ? 'victory' : 'defeat'
      $set.completedAt = new Date()
    }

    await collection.updateOne(
      { _id: new ObjectId(gameId) },
      {
        $set,
        $push: { moves: { $each: [playerMoveRecord] } },
        $inc,
      } as any,
    )

    return {
      board: currentBoard,
      lastMove: { from, to, player: 'player' },
      gameOver: gameOverCheck.over,
      result: gameOverCheck.over ? (gameOverCheck.winner === 'player' ? 'victory' : 'defeat') : undefined,
      nextPlayer: gameOverCheck.over ? undefined : 1,
      forcedPiece: gameOverCheck.over ? undefined : to,
    }
  }

  const gameOverAfterPlayer = await checkGameOver(currentBoard)
  if (gameOverAfterPlayer.over) {
    const $set: Record<string, unknown> = {
      board: currentBoard,
      currentPlayer: 1,
      updatedAt: new Date(),
      status: 'completed',
      result: gameOverAfterPlayer.winner === 'player' ? 'victory' : 'defeat',
      completedAt: new Date(),
    }

    await collection.updateOne(
      { _id: new ObjectId(gameId) },
      {
        $set,
        $push: { moves: { $each: [playerMoveRecord] } },
        $inc: { totalMoves: 1, playerMoves: 1 },
      } as any,
    )

    return {
      board: currentBoard,
      lastMove: { from, to, player: 'player' },
      gameOver: true,
      result: gameOverAfterPlayer.winner === 'player' ? 'victory' : 'defeat',
    }
  }

  // Solicitar movimiento a la IA según dificultad
  const difficulty = (game as any).difficulty || 'beginner'
  const aiResponse = await calculateMove(currentBoard, 2, difficulty)

  if (!aiResponse) {
    // La IA no tiene movimientos disponibles (sin fichas o bloqueada) → jugador gana
    const $set: Record<string, unknown> = {
      board: currentBoard,
      currentPlayer: 1,
      updatedAt: new Date(),
      status: 'completed',
      result: 'victory',
      completedAt: new Date(),
    }

    await collection.updateOne(
      { _id: new ObjectId(gameId) },
      {
        $set,
        $push: { moves: { $each: [playerMoveRecord] } },
        $inc: { totalMoves: 1, playerMoves: 1 },
      } as any,
    )

    return {
      board: currentBoard,
      lastMove: { from, to, player: 'player' },
      gameOver: true,
      result: 'victory',
    }
  }

  const movesToPush: any[] = [playerMoveRecord]
  let aiMoveResult:
    | { from: [number, number]; to: [number, number] }
    | undefined
  let gameOver = false
  let result: string | undefined

  if (aiResponse) {
    // Aplicar movimiento de la IA
    currentBoard = applyMoveToBoard(
      currentBoard,
      aiResponse.from,
      aiResponse.to,
      aiResponse.captured,
    )
    aiMoveResult = aiResponse

    const aiMoveRecord = {
      from: [aiResponse.from[0], aiResponse.from[1]],
      to: [aiResponse.to[0], aiResponse.to[1]],
      movedAt: new Date(),
      capturedPieces: aiResponse.captured,
    }
    movesToPush.push(aiMoveRecord)

    // Verificar si el jugador perdió (sin fichas o sin movimientos)
    const playerPieces = currentBoard
      .flat()
      .filter((v: number) => v === 1 || v === 3).length
    if (playerPieces === 0 || !hasValidMoves(currentBoard, true)) {
      gameOver = true
      result = 'defeat'
    }
  } else {
    // La IA no tiene movimientos disponibles
    // Verificar si la IA perdió (sin fichas o sin movimientos)
    const aiPieces = currentBoard
      .flat()
      .filter((v: number) => v === 2 || v === 4).length
    if (aiPieces === 0 || !hasValidMoves(currentBoard, false)) {
      gameOver = true
      result = 'victory'
    }
  }

  // Construir actualización de MongoDB
  const $set: Record<string, unknown> = {
    board: currentBoard,
    currentPlayer: 1,
    updatedAt: new Date(),
  }

  const $inc: Record<string, number> = {
    totalMoves: movesToPush.length,
    playerMoves: 1,
  }

  if (aiResponse) {
    $inc.aiMoves = 1
  }

  if (gameOver) {
    $set.status = 'completed'
    $set.result = result
    $set.completedAt = new Date()
  }

  await collection.updateOne(
    { _id: new ObjectId(gameId) },
    {
      $set,
      $push: { moves: { $each: movesToPush } },
      $inc,
    } as any
  )

  return {
    board: currentBoard,
    lastMove: { from, to, player: 'player' },
    gameOver,
    result,
    aiMove: aiMoveResult,
  }
}

/**
 * Verifica si el juego ha terminado basado en el estado del tablero.
 * - Si el jugador no tiene fichas o no tiene movimientos → victoria de la IA
 * - Si la IA no tiene fichas o no tiene movimientos → victoria del jugador
 *
 * @param board - Estado del tablero
 * @returns Resultado de la verificación
 */
export async function checkGameOver(
  board: number[][]
): Promise<{ over: boolean; winner?: string }> {
  const playerPieces = board
    .flat()
    .filter((v) => v === 1 || v === 3).length
  const aiPieces = board
    .flat()
    .filter((v) => v === 2 || v === 4).length

  if (playerPieces === 0) {
    return { over: true, winner: 'ai' }
  }

  if (aiPieces === 0) {
    return { over: true, winner: 'player' }
  }

  // Si tienen fichas pero no pueden mover, también pierden
  if (!hasValidMoves(board, true)) {
    return { over: true, winner: 'ai' }
  }

  if (!hasValidMoves(board, false)) {
    return { over: true, winner: 'player' }
  }

  return { over: false }
}
