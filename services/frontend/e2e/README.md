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

## Test Files

```
e2e/
├── README.md              # This file
├── home.spec.ts           # Smoke test — page loads, title, main menu visible
├── auth.spec.ts           # Auth flow — sign-in button, Clerk modal
├── navigation.spec.ts     # Navigation — menu buttons, page routing
├── game.spec.ts           # Game engine — board, pieces, difficulty, API
└── screenshots/           # Screenshots captured during tests (gitignored)
```

## Game Engine Tests (`game.spec.ts`)

Tests the core game engine in three areas:

### UI Flow Tests (require frontend only)
- **Difficulty selection**: Navigates from home → JUGAR → RETOS → difficulty page
- **Game navigation**: Selects a difficulty and verifies redirect to game play page

### Board Rendering Tests (require frontend + backend + IA)
- **Info panels**: Verifies YOU/IA labels, piece counts, timer, difficulty, surrender button
- **Board layout**: Checks the 8×8 grid has 64 squares

### API Tests (require backend running on port 3001)
- **Game creation**: Validates POST /api/game/create returns 8×8 board with 12 player pieces + 12 AI pieces
- **Validation**: Rejects missing/invalid difficulty
- **GET game**: Fetches created game by ID, validates status/board/currentPlayer
- **404 handling**: Returns 404 for unknown game IDs

> **Note**: Game rendering and API tests require the backend stack (`docker compose up -d backend ia`).
> If the backend is unreachable, these tests gracefully skip.

## Configuration

See `playwright.config.ts` at the project root for:
- Base URL: `http://localhost:3000`
- Browser: Chromium (Desktop Chrome)
- Retries: 2 on CI, 0 locally
- Trace and video: captured on first retry
