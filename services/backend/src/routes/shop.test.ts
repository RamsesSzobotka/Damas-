import { describe, test, expect, mock, beforeEach } from 'bun:test'
import { Hono } from 'hono'
import { ObjectId } from 'mongodb'

// ── Mock collections ──────────────────────────────────────
const mockUsers: any[] = []
const mockUserSkins: any[] = []
const mockSkins: any[] = []

const mockUsersCol = {
  findOne: mock((query: any) => {
    const found = mockUsers.find(u => u.clerkId === query.clerkId)
    return Promise.resolve(found || null)
  }),
}

const mockUserSkinsCol = {
  find: mock((filter: any) => ({
    toArray: () => {
      return Promise.resolve(mockUserSkins.filter(us => us.userId.equals(filter.userId)))
    },
  })),
  updateMany: mock((filter: any, update: any) => {
    for (const us of mockUserSkins) {
      let matches = true
      if (filter.userId && !filter.userId.equals(us.userId)) matches = false
      if (filter.isEquipped !== undefined && us.isEquipped !== filter.isEquipped) matches = false
      if (filter.equipType && us.equipType !== filter.equipType) matches = false
      if (filter.$or) {
        const orMatch = filter.$or.some((cond: any) => {
          if (cond.equipType === us.equipType) return true
          if (cond.equipType === null && !us.equipType) return true
          if (cond.equipType && cond.equipType.$exists === false && !us.equipType) return true
          return false
        })
        if (!orMatch) matches = false
      }
      if (matches) {
        Object.assign(us, update.$set)
      }
    }
    return Promise.resolve({ modifiedCount: 1 })
  }),
  updateOne: mock((filter: any, update: any) => {
    const idx = mockUserSkins.findIndex(us => us.skinId.toString() === filter.skinId.toString())
    if (idx >= 0) {
      Object.assign(mockUserSkins[idx], update.$set)
      return Promise.resolve({ matchedCount: 1 })
    }
    return Promise.resolve({ matchedCount: 0 })
  }),
}

const mockSkinsCol = {
  find: mock((filter: any) => ({
    toArray: () => {
      if (filter._id?.$in) {
        return Promise.resolve(mockSkins.filter(s =>
          filter._id.$in.some((id: ObjectId) => id.equals(s._id))
        ))
      }
      return Promise.resolve([...mockSkins])
    },
  })),
}

// ── Module mocks ──────────────────────────────────────────
mock.module('@clerk/backend', () => ({
  verifyToken: () => Promise.resolve({ sub: 'test-clerk-id' }),
}))

mock.module('@/database/Database', () => ({
  getDatabase: () => ({
    getCollection: (name: string) => {
      if (name === 'users') return mockUsersCol
      if (name === 'userSkins') return mockUserSkinsCol
      if (name === 'skins') return mockSkinsCol
      return { find: () => ({ toArray: () => Promise.resolve([]) }) }
    },
  }),
}))

// ── Dynamic imports after mocks ───────────────────────────
const { shopRoute } = await import('./shop')

const app = new Hono()
app.route('/', shopRoute)

// ── Helpers ───────────────────────────────────────────────
function makeRequest(path: string, options?: Record<string, any>) {
  return app.request(path, {
    headers: {
      Authorization: 'Bearer test-token',
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  })
}

describe('Shop API — equip type-aware', () => {
  const userId = new ObjectId()
  const pieceSkinId1 = new ObjectId()
  const pieceSkinId2 = new ObjectId()
  const boardSkinId1 = new ObjectId()
  const boardSkinId2 = new ObjectId()

  beforeEach(() => {
    mockUsers.length = 0
    mockUserSkins.length = 0
    mockSkins.length = 0

    mockUsers.push({ _id: userId, clerkId: 'test-clerk-id' })
  })

  // ── 4.2 ─────────────────────────────────────────────────
  test('equip piece: no desmarca board equipado', async () => {
    // Board equipado + piece equipado (otro anterior)
    mockUserSkins.push({ userId, skinId: boardSkinId1, isEquipped: true, equipType: 'board' })
    mockUserSkins.push({ userId, skinId: pieceSkinId1, isEquipped: true, equipType: 'piece' })
    mockUserSkins.push({ userId, skinId: pieceSkinId2, isEquipped: false, equipType: 'piece' })

    const res = await makeRequest('/api/shop/equip', {
      method: 'POST',
      body: JSON.stringify({ skinId: pieceSkinId2.toString(), equipType: 'piece' }),
    })

    expect(res.status).toBe(200)

    const board = mockUserSkins.find(us => us.skinId.equals(boardSkinId1))
    expect(board.isEquipped).toBe(true)

    const newPiece = mockUserSkins.find(us => us.skinId.equals(pieceSkinId2))
    expect(newPiece.isEquipped).toBe(true)

    const oldPiece = mockUserSkins.find(us => us.skinId.equals(pieceSkinId1))
    expect(oldPiece.isEquipped).toBe(false)
  })

  test('equip board: no desmarca piece equipado', async () => {
    // Piece equipado + board equipado (otro anterior)
    mockUserSkins.push({ userId, skinId: pieceSkinId1, isEquipped: true, equipType: 'piece' })
    mockUserSkins.push({ userId, skinId: boardSkinId1, isEquipped: true, equipType: 'board' })
    mockUserSkins.push({ userId, skinId: boardSkinId2, isEquipped: false, equipType: 'board' })

    const res = await makeRequest('/api/shop/equip', {
      method: 'POST',
      body: JSON.stringify({ skinId: boardSkinId2.toString(), equipType: 'board' }),
    })

    expect(res.status).toBe(200)

    const piece = mockUserSkins.find(us => us.skinId.equals(pieceSkinId1))
    expect(piece.isEquipped).toBe(true)

    const newBoard = mockUserSkins.find(us => us.skinId.equals(boardSkinId2))
    expect(newBoard.isEquipped).toBe(true)

    const oldBoard = mockUserSkins.find(us => us.skinId.equals(boardSkinId1))
    expect(oldBoard.isEquipped).toBe(false)
  })

  test('legacy sin equipType se trata como piece', async () => {
    // UserSkin sin equipType (legacy)
    mockUserSkins.push({ userId, skinId: pieceSkinId1, isEquipped: true, equipType: undefined })
    mockUserSkins.push({ userId, skinId: pieceSkinId2, isEquipped: false, equipType: undefined })

    const res = await makeRequest('/api/shop/equip', {
      method: 'POST',
      body: JSON.stringify({ skinId: pieceSkinId2.toString(), equipType: 'piece' }),
    })

    expect(res.status).toBe(200)

    const oldPiece = mockUserSkins.find(us => us.skinId.equals(pieceSkinId1))
    expect(oldPiece.isEquipped).toBe(false)

    const newPiece = mockUserSkins.find(us => us.skinId.equals(pieceSkinId2))
    expect(newPiece.isEquipped).toBe(true)
  })

  // ── 4.3 ─────────────────────────────────────────────────
  test('owned-skins retorna equippedPieceId y equippedBoardId', async () => {
    const pieceSkin = { _id: pieceSkinId1, name: 'Piece', type: 'piece', rarity: 'common', price: 199, primaryColor: '#000', secondaryColor: '#fff', imageUrl: 'img.png' }
    const boardSkin = { _id: boardSkinId1, name: 'Board', type: 'board', rarity: 'common', price: 199, primaryColor: '#111', secondaryColor: '#eee', imageUrl: 'board.png' }
    mockSkins.push(pieceSkin, boardSkin)

    mockUserSkins.push({ userId, skinId: pieceSkinId1, isEquipped: true, equipType: 'piece' })
    mockUserSkins.push({ userId, skinId: boardSkinId1, isEquipped: true, equipType: 'board' })

    const res = await makeRequest('/api/shop/owned-skins', { method: 'GET' })
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.equippedPieceId).toBe(pieceSkinId1.toString())
    expect(data.equippedBoardId).toBe(boardSkinId1.toString())
    expect(data.ownedSkins).toBeDefined()
    expect(Array.isArray(data.ownedSkins)).toBe(true)
  })

  test('owned-skins con solo piece equipado retorna boardId null', async () => {
    const pieceSkin = { _id: pieceSkinId1, name: 'Piece', type: 'piece', rarity: 'common', price: 199, primaryColor: '#000', secondaryColor: '#fff', imageUrl: 'img.png' }
    mockSkins.push(pieceSkin)
    mockUserSkins.push({ userId, skinId: pieceSkinId1, isEquipped: true, equipType: 'piece' })

    const res = await makeRequest('/api/shop/owned-skins', { method: 'GET' })
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.equippedPieceId).toBe(pieceSkinId1.toString())
    expect(data.equippedBoardId).toBeNull()
  })

  test('owned-skins vacio retorna arrays vacios y null ids', async () => {
    const res = await makeRequest('/api/shop/owned-skins', { method: 'GET' })
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.ownedSkins).toEqual([])
  })
})
