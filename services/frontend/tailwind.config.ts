import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'space-dark': '#0B0D2B',
        'space-panel': '#1E2547',
        'accent-magenta': '#C026D3',
        'accent-gold': '#FFD700',
        'accent-cyan': '#67E8F9',
        'text-primary': '#FFFFFF',
        'text-space': '#B0E0FF',
        'player-red': '#FF4D6B',
        'player-white': '#F0F8FF',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        mono: ['VT323', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
