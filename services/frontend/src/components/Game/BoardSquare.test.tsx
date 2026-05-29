import { describe, test, expect } from 'vitest'
import { render } from '@testing-library/react'
import BoardSquare from './BoardSquare'

describe('BoardSquare', () => {
  test('usa darkColor y lightColor proporcionados', () => {
    const { container } = render(
      <BoardSquare
        row={0}
        col={1}
        piece={0}
        isSelected={false}
        isValidMove={false}
        onClick={() => {}}
        darkColor="#0D0D0D"
        lightColor="#F0F0F0"
      />
    )

    const square = container.firstChild as HTMLElement
    expect(square).toBeInTheDocument()
    expect(square.style.backgroundColor).toBe('rgb(13, 13, 13)')
  })

  test('dark square (row+col=impar) usa darkColor', () => {
    const { container } = render(
      <BoardSquare
        row={0}
        col={1}
        piece={0}
        isSelected={false}
        isValidMove={false}
        onClick={() => {}}
        darkColor="#1A1050"
        lightColor="#4C3F91"
      />
    )

    const square = container.firstChild as HTMLElement
    expect(square.style.backgroundColor).toBe('rgb(26, 16, 80)')
  })

  test('light square (row+col=par) usa lightColor', () => {
    const { container } = render(
      <BoardSquare
        row={0}
        col={0}
        piece={0}
        isSelected={false}
        isValidMove={false}
        onClick={() => {}}
        darkColor="#1A1050"
        lightColor="#4C3F91"
      />
    )

    const square = container.firstChild as HTMLElement
    expect(square.style.backgroundColor).toBe('rgb(76, 63, 145)')
  })

  test('sin props dark square usa default #1A1040', () => {
    const { container } = render(
      <BoardSquare
        row={0}
        col={1}
        piece={0}
        isSelected={false}
        isValidMove={false}
        onClick={() => {}}
      />
    )

    const square = container.firstChild as HTMLElement
    expect(square.style.backgroundColor).toBe('rgb(26, 16, 64)')
  })

  test('sin props light square usa default #4C3F91', () => {
    const { container } = render(
      <BoardSquare
        row={0}
        col={0}
        piece={0}
        isSelected={false}
        isValidMove={false}
        onClick={() => {}}
      />
    )

    const square = container.firstChild as HTMLElement
    expect(square.style.backgroundColor).toBe('rgb(76, 63, 145)')
  })
})
