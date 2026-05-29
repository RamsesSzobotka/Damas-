import { describe, test, expect, mock, beforeEach } from 'bun:test'

const mockSkins: any[] = []

const mockSkinsCol = {
  findOne: mock((query: any) => {
    const found = mockSkins.find(s => s.name === query.name)
    return Promise.resolve(found || null)
  }),
  insertOne: mock((doc: any) => {
    mockSkins.push(doc)
    return Promise.resolve({ insertedId: 'mock-id' })
  }),
}

mock.module('./Database', () => ({
  getDatabase: () => ({
    getCollection: () => mockSkinsCol,
  }),
}))

const { seedShopSkins } = await import('./seed')

describe('seedShopSkins', () => {
  beforeEach(() => {
    mockSkins.length = 0
    mockSkinsCol.findOne.mockClear()
    mockSkinsCol.insertOne.mockClear()
    mockSkinsCol.findOne.mockImplementation((query: any) => {
      const found = mockSkins.find(s => s.name === query.name)
      return Promise.resolve(found || null)
    })
  })

  test('debe insertar 5 boards con type board', async () => {
    await seedShopSkins()

    const boards = mockSkins.filter(s => s.type === 'board')
    expect(boards).toHaveLength(5)

    for (const board of boards) {
      expect(board.type).toBe('board')
      expect(board.price).toBe(199)
      expect(board.rarity).toBe('common')
    }
  })

  test('cada board debe tener primaryColor y secondaryColor', async () => {
    await seedShopSkins()

    const boards = mockSkins.filter(s => s.type === 'board')
    expect(boards).toHaveLength(5)

    for (const board of boards) {
      expect(board.primaryColor).toBeDefined()
      expect(board.secondaryColor).toBeDefined()
      expect(board.primaryColor).toMatch(/^#/)
      expect(board.secondaryColor).toMatch(/^#/)
    }
  })
})
