import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for Clerk to load and page to be fully rendered
    await page.waitForLoadState('networkidle')
  })

  test('should show all main menu buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'JUGAR' })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('ESPECTADOR')).toBeVisible()
    await expect(page.getByText('RANKINGS')).toBeVisible()
    await expect(page.getByText('TIENDA')).toBeVisible()
  })

  test('should navigate to rankings page', async ({ page }) => {
    // Use force:true because buttons have CSS glow animations
    await page.getByText('RANKINGS').click({ force: true })
    await page.waitForTimeout(800)
    expect(page.url()).toContain('/rankings')
  })

  test('should navigate to shop page', async ({ page }) => {
    await page.getByText('TIENDA').click({ force: true })
    await page.waitForTimeout(800)
    expect(page.url()).toContain('/shop')
  })

  test('should navigate to spectator page', async ({ page }) => {
    await page.getByText('ESPECTADOR').click({ force: true })
    await page.waitForTimeout(800)
    expect(page.url()).toContain('/spectator')
  })

  test('should open JUGAR submenu with game options', async ({ page }) => {
    await page.getByText('JUGAR').click({ force: true })
    await page.waitForTimeout(500)

    await expect(page.getByText('ELIGE UN MODO')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('RANKED')).toBeVisible()
    await expect(page.getByText('RETOS')).toBeVisible()
    await expect(page.getByText('PERSONALIZACIÓN')).toBeVisible()
  })
})
