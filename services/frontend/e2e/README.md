# E2E Tests

End-to-end tests using Playwright for the Damas frontend.

## Prerequisites

- The frontend dev server must be running: `bun run dev` (defaults to `http://localhost:3000`)
- Playwright browsers installed (run `bunx playwright install chromium`)

## Running Tests

```bash
# Run all e2e tests headlessly
bun run test:e2e

# Run tests with visible browser window
bun run test:e2e:headed

# Open Playwright UI mode (interactive test runner)
bun run test:e2e:ui

# Run a single test file
bunx playwright test e2e/home.spec.ts
```

## File Structure

```
e2e/
├── README.md              # This file
├── home.spec.ts           # Smoke test — page loads, title, main menu visible
├── auth.spec.ts           # Auth flow — sign-in button, Clerk modal
├── navigation.spec.ts     # Navigation — menu buttons, page routing
└── screenshots/           # Screenshots captured during tests (gitignored)
```

## Configuration

See `playwright.config.ts` at the project root for:
- Base URL: `http://localhost:3000`
- Browser: Chromium (Desktop Chrome)
- Retries: 2 on CI, 0 locally
- Trace and video: captured on first retry
