import { describe, expect, it } from 'vitest'
import { ApiError } from './ApiError'

describe('ApiError', () => {
  it('maps backend error payload', () => {
    const error = ApiError.fromResponse(
      { code: 'not_found', message: 'Session not found' },
      404,
      'req-123',
    )

    expect(error.code).toBe('not_found')
    expect(error.httpStatus).toBe(404)
    expect(error.requestId).toBe('req-123')
  })
})
