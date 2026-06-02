export function calculateValidMoves(
  board: number[][],
  selectedPiece: [number, number] | null,
): [number, number][] {
  if (!selectedPiece) return []

  const [row, col] = selectedPiece
  const piece = board[row]?.[col]
  if (!piece || piece === 0) return []

  const isPlayer = piece === 1 || piece === 3
  const isKing = piece === 3 || piece === 4

  if (!isPlayer) return []

  const directions: [number, number][] = isKing
    ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
    : [[-1, -1], [-1, 1]]

  const simpleMoves: [number, number][] = []
  const captureMoves: [number, number][] = []

  const addCaptureMovesForDirection = (dr: number, dc: number): void => {
    let enemySeen = false

    for (let step = 1; ; step++) {
      const scanRow = row + dr * step
      const scanCol = col + dc * step

      if (scanRow < 0 || scanRow >= 8 || scanCol < 0 || scanCol >= 8) {
        break
      }

      const cell = board[scanRow][scanCol]

      if (!enemySeen) {
        if (cell === 0) continue
        if (cell === 1 || cell === 3) break

        enemySeen = true
        continue
      }

      if (cell !== 0) break

      captureMoves.push([scanRow, scanCol])
    }
  }

  for (const [dr, dc] of directions) {
    if (isKing) {
      addCaptureMovesForDirection(dr, dc)
    } else {
      const nr = row + dr
      const nc = col + dc
      const cr = row + 2 * dr
      const cc = col + 2 * dc
      const midPiece = board[nr]?.[nc]

      if (
        cr >= 0 &&
        cr < 8 &&
        cc >= 0 &&
        cc < 8 &&
        midPiece !== 0 &&
        midPiece !== undefined &&
        (midPiece === 2 || midPiece === 4) &&
        board[cr][cc] === 0
      ) {
        captureMoves.push([cr, cc])
      }
    }
  }

  if (captureMoves.length > 0) return captureMoves

  for (const [dr, dc] of directions) {
    if (isKing) {
      for (let step = 1; ; step++) {
        const nr = row + dr * step
        const nc = col + dc * step

        if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) {
          break
        }

        if (board[nr][nc] !== 0) break
        simpleMoves.push([nr, nc])
      }
    } else {
      const nr = row + dr
      const nc = col + dc

      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && board[nr][nc] === 0) {
        simpleMoves.push([nr, nc])
      }
    }
  }

  return simpleMoves
}

export function applyPreviewMove(
  board: number[][],
  from: [number, number],
  to: [number, number],
): number[][] {
  const nextBoard = board.map((row) => [...row])
  const piece = nextBoard[from[0]][from[1]]

  nextBoard[from[0]][from[1]] = 0
  nextBoard[to[0]][to[1]] = piece

  const isCapture = Math.abs(from[0] - to[0]) > 1 && Math.abs(from[1] - to[1]) > 1
  if (isCapture) {
    const stepRow = Math.sign(to[0] - from[0])
    const stepCol = Math.sign(to[1] - from[1])

    for (
      let row = from[0] + stepRow, col = from[1] + stepCol;
      row !== to[0] && col !== to[1];
      row += stepRow, col += stepCol
    ) {
      if (nextBoard[row][col] !== 0) {
        nextBoard[row][col] = 0
        break
      }
    }
  }

  if (piece === 1 && to[0] === 0) nextBoard[to[0]][to[1]] = 3
  if (piece === 2 && to[0] === 7) nextBoard[to[0]][to[1]] = 4

  return nextBoard
}