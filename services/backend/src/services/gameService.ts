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
 * Aplica un movimiento al tablero (optimistamente, sin validación de reglas).
 * - Mueve la ficha desde `from` a `to`
 * - Detecta capturas (movimiento diagonal de 2 casillas)
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
    // Detectar captura (punto medio entre from y to)
    const midRow = (from[0] + to[0]) / 2
    const midCol = (from[1] + to[1]) / 2
    if (Number.isInteger(midRow) && Number.isInteger(midCol)) {
      const capturedPiece = newBoard[midRow][midCol]
      if (capturedPiece !== 0) {
        newBoard[midRow][midCol] = 0
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
 * @returns gameId y tablero inicial
 */
export async function createGame(
  difficulty: string
): Promise<{ gameId: string; board: number[][] }> {
  const board = createInitialBoard()

  const game = {
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
  let currentBoard = applyMoveToBoard(game.board as number[][], from, to)
  const pieceAfterMove = currentBoard[to[0]][to[1]]
  const isCapture = Math.abs(from[0] - to[0]) === 2
  const promotedThisMove = movedPiece === 1 && to[0] === 0

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

    for (const [dr, dc] of directions) {
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
        const sameSide = (piece === 1 || piece === 3)
          ? (enemyPiece === 1 || enemyPiece === 3)
          : (enemyPiece === 2 || enemyPiece === 4)

        if (!sameSide && enemyPiece !== 0 && landingPiece === 0) {
          return true
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

  const playerCanContinue =
    isCapture && !promotedThisMove && canContinueCapture(currentBoard, to[0], to[1])

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

  // Solicitar movimiento a la IA
  const aiResponse = await calculateMove(currentBoard, 2) // currentPlayer=2 (IA)

  if (!aiResponse) {
    const aiStuck = await checkGameOver(currentBoard)
    if (aiStuck.over) {
      const $set: Record<string, unknown> = {
        board: currentBoard,
        currentPlayer: 1,
        updatedAt: new Date(),
        status: 'completed',
        result: aiStuck.winner === 'player' ? 'victory' : 'defeat',
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
        result: aiStuck.winner === 'player' ? 'victory' : 'defeat',
      }
    }

    throw new Error('AI returned no move')
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

    // Verificar si el jugador perdió (no tiene fichas)
    const playerPieces = currentBoard
      .flat()
      .filter((v: number) => v === 1 || v === 3).length
    if (playerPieces === 0) {
      gameOver = true
      result = 'defeat'
    }
  } else {
    // La IA no tiene movimientos disponibles
    // Verificar si la IA no tiene fichas → el jugador gana
    const aiPieces = currentBoard
      .flat()
      .filter((v: number) => v === 2 || v === 4).length
    if (aiPieces === 0) {
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
 * - Si el jugador no tiene fichas → victoria de la IA (derrota)
 * - Si la IA no tiene fichas → victoria del jugador
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

  return { over: false }
}
