export type ApiErrorBody = {
  code: string
  message: string
  details?: string | null
}

export class ApiError extends Error {
  readonly code: string
  readonly httpStatus: number
  readonly details: string | null | undefined
  readonly requestId: string | null

  constructor(
    message: string,
    options: {
      code: string
      httpStatus: number
      details?: string | null
      requestId?: string | null
    },
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = options.code
    this.httpStatus = options.httpStatus
    this.details = options.details
    this.requestId = options.requestId ?? null
  }

  static fromResponse(body: ApiErrorBody, httpStatus: number, requestId?: string | null) {
    return new ApiError(body.message, {
      code: body.code,
      httpStatus,
      details: body.details,
      requestId,
    })
  }

  static network(message = 'Network error. Check your connection and try again.') {
    return new ApiError(message, {
      code: 'network_error',
      httpStatus: 0,
    })
  }
}
