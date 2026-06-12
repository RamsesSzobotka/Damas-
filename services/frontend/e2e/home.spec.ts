import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test('should load the game title and main menu', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toContainText('DAMAS', { timeout: 10000 })
    await expect(page.getByText('Universe')).toBeVisible()

    await expect(page.getByRole('button', { name: 'JUGAR' })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('ESPECTADOR')).toBeVisible()
    await expect(page.getByText('RANKINGS')).toBeVisible()
    await expect(page.getByText('TIENDA')).toBeVisible()

    // Clerk button appears after auth state resolves
    await expect(page.getByRole('button', { name: 'INICIAR SESIÓN' })).toBeVisible({ timeout: 15000 })
  })

  test('should take a screenshot of the home page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000) // let animations settle
    await page.screenshot({ path: 'e2e/screenshots/home.png', fullPage: true })
  })
})
