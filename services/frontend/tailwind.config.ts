import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0A0A0F',
        'bg-secondary': '#1C1C24',
        'accent-red': '#E31C2B',
        'accent-red-light': '#FF4D5C',
        'gold': '#FFD700',
        'gold-dark': '#B8960F',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B0B0C8',
        'piece-highlight': '#FF9E9E',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
