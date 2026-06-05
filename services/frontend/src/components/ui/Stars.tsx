'use client'

import { useEffect, useRef } from 'react'

type WhiteStar = { x: number; y: number; r: number; speed: number }
type ColoredStar = { x: number; y: number; r: number; speed: number; phase: number; baseAlpha: number; color: string }
type GlintStar = { x: number; y: number; r: number; phase: number; baseAlpha: number; crossLen: number }
type ShootingStar = {
  active: boolean
  x: number
  y: number
  vx: number
  vy: number
  life: number
  lifeMax: number
  respawnCounter: number
  respawnMax: number
  length: number
  speed: number
}

const STAR_COLORS = ['#67E8F9', '#FFD700', '#C026D3']

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function randInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1))
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}

export default function Stars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const whiteStars: WhiteStar[] = []
    for (let i = 0; i < 120; i++) {
      whiteStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.2 + 0.05,
      })
    }

    const coloredStars: ColoredStar[] = []
    const coloredCount = 12
    for (let i = 0; i < coloredCount; i++) {
      const color = STAR_COLORS[randInt(0, STAR_COLORS.length - 1)]
      coloredStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: rand(1.5, 2.5),
        speed: rand(0.03, 0.1),
        phase: Math.random() * Math.PI * 2,
        baseAlpha: rand(0.4, 0.7),
        color,
      })
    }

    const glintStars: GlintStar[] = []
    const glintCount = 4
    for (let i = 0; i < glintCount; i++) {
      glintStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: rand(3, 4),
        phase: Math.random() * Math.PI * 2,
        baseAlpha: rand(0.4, 0.7),
        crossLen: rand(6, 10),
      })
    }

    const shooting: ShootingStar = {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      lifeMax: 90,
      respawnCounter: randInt(180, 480),
      respawnMax: randInt(180, 480),
      length: 0,
      speed: 0,
    }

    function spawnShootingStar() {
      const c = canvas!
      shooting.active = true
      shooting.x = c.width * rand(0.5, 1.0)
      shooting.y = c.height * rand(0.0, 0.4)
      const speed = rand(8, 12)
      const angle = rand(Math.PI * 0.65, Math.PI * 0.85)
      shooting.vx = Math.cos(angle) * speed
      shooting.vy = Math.sin(angle) * speed
      shooting.speed = speed
      shooting.life = 0
      shooting.lifeMax = 90
      shooting.length = rand(60, 100)
      shooting.respawnMax = randInt(180, 480)
    }

    function drawWhiteStars() {
      for (const s of whiteStars) {
        const alpha = Math.random() > 0.98 ? 0.9 + Math.random() * 0.1 : 0.3 + Math.random() * 0.5
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx!.fill()
      }
    }

    function drawColoredStars() {
      for (const s of coloredStars) {
        const alpha = s.baseAlpha + Math.sin(s.phase) * 0.15
        const a = Math.max(0.2, Math.min(0.9, alpha))
        const { r, g, b } = hexToRgb(s.color)
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
        ctx!.fill()
      }
    }

    function drawGlintStars() {
      for (const g of glintStars) {
        const isBright = Math.random() < 0.04
        const baseGlow = g.baseAlpha + Math.sin(g.phase) * 0.1
        const alpha = isBright ? 1.0 : Math.max(0.1, Math.min(1, baseGlow))
        const coreR = isBright ? g.r * 1.3 : g.r
        const lineLen = isBright ? g.crossLen * 1.5 : g.crossLen

        ctx!.beginPath()
        ctx!.arc(g.x, g.y, coreR, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx!.fill()

        ctx!.strokeStyle = `rgba(255, 250, 220, ${alpha * 0.8})`
        ctx!.lineWidth = 0.8
        ctx!.beginPath()
        ctx!.moveTo(g.x, g.y - lineLen)
        ctx!.lineTo(g.x, g.y - coreR)
        ctx!.moveTo(g.x, g.y + coreR)
        ctx!.lineTo(g.x, g.y + lineLen)
        ctx!.moveTo(g.x + coreR, g.y)
        ctx!.lineTo(g.x + lineLen, g.y)
        ctx!.moveTo(g.x - lineLen, g.y)
        ctx!.lineTo(g.x - coreR, g.y)
        ctx!.stroke()
      }
    }

    function drawShootingStar() {
      if (!shooting.active) return
      const lifeRatio = shooting.life / shooting.lifeMax
      const alpha = Math.max(0, 1 - lifeRatio)
      const norm = Math.sqrt(shooting.vx * shooting.vx + shooting.vy * shooting.vy) || 1
      const tailX = shooting.x - (shooting.vx / norm) * shooting.length
      const tailY = shooting.y - (shooting.vy / norm) * shooting.length
      ctx!.save()
      ctx!.globalCompositeOperation = 'lighter'
      const grad = ctx!.createLinearGradient(tailX, tailY, shooting.x, shooting.y)
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)')
      grad.addColorStop(1, `rgba(220, 240, 255, ${alpha})`)
      ctx!.strokeStyle = grad
      ctx!.lineWidth = 2
      ctx!.beginPath()
      ctx!.moveTo(tailX, tailY)
      ctx!.lineTo(shooting.x, shooting.y)
      ctx!.stroke()
      ctx!.beginPath()
      ctx!.arc(shooting.x, shooting.y, 1.5, 0, Math.PI * 2)
      ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx!.fill()
      ctx!.restore()
    }

    function update() {
      const c = canvas!
      for (const s of whiteStars) {
        s.y -= s.speed
        if (s.y < 0) {
          s.y = c.height
          s.x = Math.random() * c.width
        }
      }
      for (const s of coloredStars) {
        s.y -= s.speed
        if (s.y < 0) {
          s.y = c.height
          s.x = Math.random() * c.width
        }
        s.phase += 0.015
      }
      for (const g of glintStars) {
        g.y -= 0.05
        if (g.y < 0) {
          g.y = c.height
          g.x = Math.random() * c.width
        }
        g.phase += 0.01
      }
      if (!shooting.active) {
        shooting.respawnCounter--
        if (shooting.respawnCounter <= 0) spawnShootingStar()
      } else {
        shooting.life++
        shooting.x += shooting.vx
        shooting.y += shooting.vy
        if (shooting.life >= shooting.lifeMax) {
          shooting.active = false
          shooting.respawnCounter = shooting.respawnMax
        }
      }
    }

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawWhiteStars()
      drawColoredStars()
      drawGlintStars()
      drawShootingStar()
    }

    let frame = 0
    function animate() {
      update()
      draw()
      frame = requestAnimationFrame(animate)
    }

    if (reducedMotion) {
      draw()
    } else {
      animate()
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      draw()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  )
}
