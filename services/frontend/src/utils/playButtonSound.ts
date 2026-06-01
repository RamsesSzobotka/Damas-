import buttonSoundSrc from '@/assets/sounds/buttonSound.mp3'

let audio: HTMLAudioElement | null = null

export function playButtonSound() {
  try {
    if (!audio) {
      audio = new Audio(buttonSoundSrc)
    }
    audio.currentTime = 0
    audio.volume = 0.3
    audio.play().catch(() => {})
  } catch {
    // Audio not supported
  }
}
