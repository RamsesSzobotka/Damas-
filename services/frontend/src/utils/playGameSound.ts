import moveSoundSrc from '@/assets/sounds/moveSound.mp3'
import eatSoundSrc from '@/assets/sounds/eatSound.mp3'
import kingSoundSrc from '@/assets/sounds/king.mp3'

const MOVE_VOLUME = 0.3
const EAT_VOLUME = 0.6
const KING_VOLUME = 0.5

export function playMoveSound() {
  try {
    const audio = new Audio(moveSoundSrc)
    audio.volume = MOVE_VOLUME
    audio.play().catch(() => {
      // Browser autoplay policy or temporary issue — silent fail
    })
  } catch {
    // Audio not supported
  }
}

export function playEatSound() {
  try {
    const audio = new Audio(eatSoundSrc)
    audio.volume = EAT_VOLUME
    audio.play().catch(() => {
      // Browser autoplay policy or temporary issue — silent fail
    })
  } catch {
    // Audio not supported
  }
}

export function playKingSound() {
  try {
    const audio = new Audio(kingSoundSrc)
    audio.volume = KING_VOLUME
    audio.play().catch(() => {
      // Browser autoplay policy or temporary issue — silent fail
    })
  } catch {
    // Audio not supported
  }
}

/** Reproduce el sonido correspondiente según si el movimiento es captura o no */
export function playSoundForMove(from: [number, number] | undefined, to: [number, number] | undefined) {
  // Validar que from y to sean arrays válidos
  if (!Array.isArray(from) || !Array.isArray(to) || from.length !== 2 || to.length !== 2) {
    console.debug('Invalid move coordinates for sound:', { from, to })
    playMoveSound() // fallback
    return
  }

  // Siempre reproducir moveSound
  playMoveSound()
  
  // Si es captura, reproducir también eatSound
  const isCapture = Math.abs(from[0] - to[0]) > 1 && Math.abs(from[1] - to[1]) > 1
  if (isCapture) {
    // Pequeño delay para que no suenen exactamente al mismo tiempo
    setTimeout(() => {
      playEatSound()
    }, 100)
  }
}
