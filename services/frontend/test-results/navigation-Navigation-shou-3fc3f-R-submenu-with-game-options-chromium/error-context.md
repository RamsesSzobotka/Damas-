# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Navigation >> should open JUGAR submenu with game options
- Location: e2e\navigation.spec.ts:36:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('RANKED')
Expected: visible
Error: strict mode violation: getByText('RANKED') resolved to 2 elements:
    1) <p class="text-xs uppercase tracking-wider opacity-80">Partida ranked vs IA</p> aka getByRole('button', { name: '▶ JUGAR Partida ranked vs IA →' })
    2) <p class="text-sm font-bold uppercase tracking-widest">RANKED</p> aka getByRole('button', { name: '🏆 RANKED →' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('RANKED')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - button "INICIAR SESIÓN" [ref=e7] [cursor=pointer]
  - main [ref=e8]:
    - generic [ref=e10]:
      - heading "D A M A S" [level=1] [ref=e11]:
        - generic [ref=e12]: D
        - generic [ref=e13]: A
        - generic [ref=e14]: M
        - generic [ref=e15]: A
        - generic [ref=e16]: S
      - paragraph [ref=e17]: Universe
      - generic [ref=e18]:
        - generic [ref=e19]: ⬜
        - generic [ref=e20]: ⬜
        - generic [ref=e21]: ⬜
        - generic [ref=e22]: ⬜
        - generic [ref=e23]: ⬜
        - generic [ref=e24]: ⬜
        - generic [ref=e25]: ⬜
        - generic [ref=e26]: ⬜
    - generic [ref=e28]:
      - button "▶ JUGAR Partida ranked vs IA →" [expanded] [active] [ref=e30] [cursor=pointer]:
        - generic [ref=e31]:
          - generic [ref=e32]: ▶
          - generic [ref=e33]:
            - paragraph [ref=e34]: JUGAR
            - paragraph [ref=e35]: Partida ranked vs IA
          - generic [ref=e36]: →
      - button "🛰️ ESPECTADOR Observa 2 IAs enfrentarse →" [ref=e38] [cursor=pointer]:
        - generic [ref=e39]:
          - generic [ref=e40]: 🛰️
          - generic [ref=e41]:
            - paragraph [ref=e42]: ESPECTADOR
            - paragraph [ref=e43]: Observa 2 IAs enfrentarse
          - generic [ref=e44]: →
      - button "📊 RANKINGS Tabla de puntuaciones →" [ref=e46] [cursor=pointer]:
        - generic [ref=e47]:
          - generic [ref=e48]: 📊
          - generic [ref=e49]:
            - paragraph [ref=e50]: RANKINGS
            - paragraph [ref=e51]: Tabla de puntuaciones
          - generic [ref=e52]: →
      - button "🛍️ TIENDA Comprar skins →" [ref=e54] [cursor=pointer]:
        - generic [ref=e55]:
          - generic [ref=e56]: 🛍️
          - generic [ref=e57]:
            - paragraph [ref=e58]: TIENDA
            - paragraph [ref=e59]: Comprar skins
          - generic [ref=e60]: →
    - dialog "Opciones de juego" [ref=e61]:
      - paragraph [ref=e62]: ELIGE UN MODO
      - button "🏆 RANKED →" [ref=e65] [cursor=pointer]:
        - generic [ref=e66]:
          - generic [ref=e67]: 🏆
          - paragraph [ref=e69]: RANKED
          - generic [ref=e70]: →
      - button "🎯 RETOS →" [ref=e73] [cursor=pointer]:
        - generic [ref=e74]:
          - generic [ref=e75]: 🎯
          - paragraph [ref=e77]: RETOS
          - generic [ref=e78]: →
      - button "🎨 PERSONALIZACIÓN →" [ref=e81] [cursor=pointer]:
        - generic [ref=e82]:
          - generic [ref=e83]: 🎨
          - paragraph [ref=e85]: PERSONALIZACIÓN
          - generic [ref=e86]: →
      - button "Volver al menú principal" [ref=e87] [cursor=pointer]: ← VOLVER
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('Navigation', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/')
  6  |     // Wait for Clerk to load and page to be fully rendered
  7  |     await page.waitForLoadState('networkidle')
  8  |   })
  9  | 
  10 |   test('should show all main menu buttons', async ({ page }) => {
  11 |     await expect(page.getByRole('button', { name: 'JUGAR' })).toBeVisible({ timeout: 10000 })
  12 |     await expect(page.getByText('ESPECTADOR')).toBeVisible()
  13 |     await expect(page.getByText('RANKINGS')).toBeVisible()
  14 |     await expect(page.getByText('TIENDA')).toBeVisible()
  15 |   })
  16 | 
  17 |   test('should navigate to rankings page', async ({ page }) => {
  18 |     // Use force:true because buttons have CSS glow animations
  19 |     await page.getByText('RANKINGS').click({ force: true })
  20 |     await page.waitForTimeout(800)
  21 |     expect(page.url()).toContain('/rankings')
  22 |   })
  23 | 
  24 |   test('should navigate to shop page', async ({ page }) => {
  25 |     await page.getByText('TIENDA').click({ force: true })
  26 |     await page.waitForTimeout(800)
  27 |     expect(page.url()).toContain('/shop')
  28 |   })
  29 | 
  30 |   test('should navigate to spectator page', async ({ page }) => {
  31 |     await page.getByText('ESPECTADOR').click({ force: true })
  32 |     await page.waitForTimeout(800)
  33 |     expect(page.url()).toContain('/spectator')
  34 |   })
  35 | 
  36 |   test('should open JUGAR submenu with game options', async ({ page }) => {
  37 |     await page.getByText('JUGAR').click({ force: true })
  38 |     await page.waitForTimeout(500)
  39 | 
  40 |     await expect(page.getByText('ELIGE UN MODO')).toBeVisible({ timeout: 5000 })
> 41 |     await expect(page.getByText('RANKED')).toBeVisible()
     |                                            ^ Error: expect(locator).toBeVisible() failed
  42 |     await expect(page.getByText('RETOS')).toBeVisible()
  43 |     await expect(page.getByText('PERSONALIZACIÓN')).toBeVisible()
  44 |   })
  45 | })
  46 | 
```