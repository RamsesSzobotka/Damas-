import moveSoundSrc from '@/assets/sounds/moveSound.mp3'
import eatSoundSrc from '@/assets/sounds/eatSound.mp3'

let moveAudio: HTMLAudioElement | null = null
let eatAudio: HTMLAudioElement | null = null

export function playMoveSound() {
  try {
    if (!moveAudio) {
      moveAudio = new Audio(moveSoundSrc)
    }
    moveAudio.currentTime = 0
    moveAudio.volume = 0.3
    moveAudio.play().catch(() => {})
  } catch {
    // Audio not supported
  }
}

export function playEatSound() {
  try {
    if (!eatAudio) {
      eatAudio = new Audio(eatSoundSrc)
    }
    eatAudio.currentTime = 0
    eatAudio.volume = 0.3
    eatAudio.play().catch(() => {})
  } catch {
    // Audio not supported
  }
}

/** Reproduce el sonido correspondiente según si el movimiento es captura o no */
export function playSoundForMove(from: [number, number], to: [number, number]) {
  const isCapture = Math.abs(from[0] - to[0]) > 1 && Math.abs(from[1] - to[1]) > 1
  if (isCapture) {
    playEatSound()
  } else {
    playMoveSound()
  }
}
