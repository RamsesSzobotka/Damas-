import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test.use({ storageState: undefined })

  test('should show the sign-in button when not authenticated', async ({ page }) => {
    await page.goto('/')

    // Clerk needs time to load auth state; wait for the button to appear
    const signInButton = page.getByRole('button', { name: 'INICIAR SESIÓN' })
    await expect(signInButton).toBeVisible({ timeout: 15000 })
  })

  test('sign-in button should trigger Clerk auth modal', async ({ page }) => {
    await page.goto('/')

    // Wait for Clerk to load and render the sign-in button
    const signInButton = page.getByRole('button', { name: 'INICIAR SESIÓN' })
    await expect(signInButton).toBeVisible({ timeout: 15000 })

    // Use force:true because the button has CSS transitions (glow/shadow animations)
    await signInButton.click({ force: true })

    // Wait for Clerk modal to appear
    const clerkModal = page.locator('.cl-signIn-root, .cl-card, [class*="cl-signIn"]').first()
    await expect(clerkModal).toBeVisible({ timeout: 15000 })
  })
})
