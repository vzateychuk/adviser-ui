import { describe, expect, it } from 'vitest'
import { displayUserContent } from './displayUserContent'

describe('displayUserContent', () => {
  it('extracts patient question from expanded first-turn prompt', () => {
    const raw = `## Patient Request
Hello, this is a test.

## Initial KB Excerpts
hidden context`
    expect(displayUserContent(raw)).toBe('Hello, this is a test.')
  })

  it('returns plain content unchanged', () => {
    expect(displayUserContent('Простой вопрос')).toBe('Простой вопрос')
  })
})
