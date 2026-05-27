/**
 * IA Service HTTP Client
 * 
 * Cliente para comunicarse con el servicio de IA de damas.
 * Proporciona una interfaz tipada para calcular movimientos.
 */

const IA_SERVICE_URL = process.env.IA_SERVICE_URL || 'http://localhost:3002'

export interface AIMoveResponse {
  from: [number, number]
  to: [number, number]
}

/**
 * Solicita un movimiento al servicio de IA
 * @param board - Estado actual del tablero (8x8)
 * @param currentPlayer - Jugador que debe mover (1 = humano, 2 = IA)
 * @returns Coordenadas del movimiento calculado, o null si no hay movimientos disponibles o hay error
 */
export async function calculateMove(
  board: number[][],
  currentPlayer: number
): Promise<AIMoveResponse | null> {
  try {
    const response = await fetch(`${IA_SERVICE_URL}/calculate-move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ board, currentPlayer }),
    })

    if (!response.ok) {
      console.error(`IA Service returned status ${response.status}`)
      return null
    }

    const data = await response.json()
    return data as AIMoveResponse
  } catch (error) {
    console.error('Error calling IA Service:', error)
    return null
  }
}
