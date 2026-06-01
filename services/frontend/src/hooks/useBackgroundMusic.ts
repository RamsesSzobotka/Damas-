import { useEffect, useRef } from 'react'
import mainThemeSrc from '@/assets/music/01. Main Theme.mp3'
import shopThemeSrc from '@/assets/music/02. Shop Theme.mp3'
import bossThemeSrc from '@/assets/music/05. Boss Theme.mp3'

const tracks = {
  main: mainThemeSrc,
  shop: shopThemeSrc,
  boss: bossThemeSrc,
} as const

type Track = keyof typeof tracks

let bgAudio: HTMLAudioElement | null = null
let activeCount = 0

export function useBackgroundMusic(enabled: boolean, track: Track = 'main') {
  const wasEnabled = useRef(false)

  useEffect(() => {
    if (!enabled) {
      wasEnabled.current = false
      return
    }

    wasEnabled.current = true
    activeCount++

    const src = tracks[track]

    if (!bgAudio || bgAudio.src !== src) {
      if (bgAudio) {
        bgAudio.pause()
        bgAudio.currentTime = 0
      }
      bgAudio = new Audio(src)
      bgAudio.loop = true
      bgAudio.volume = 0.15
    }

    bgAudio.play().catch(() => {})

    return () => {
      if (!wasEnabled.current) return
      activeCount--
      if (activeCount <= 0 && bgAudio) {
        bgAudio.pause()
        bgAudio.currentTime = 0
        bgAudio = null
      }
    }
  }, [enabled, track])
}
