import { config } from '../config/env'
import { ApiError, type ApiErrorBody } from '../errors/ApiError'

function resolveUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const base = config.apiBaseUrl.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

function throwApiError(response: Response, body: unknown): never {
  const requestId = response.headers.get('x-request-id')

  if (body && typeof body === 'object' && 'code' in body && 'message' in body) {
    throw ApiError.fromResponse(body as ApiErrorBody, response.status, requestId)
  }

  throw new ApiError(response.statusText || 'Request failed', {
    code: 'internal_error',
    httpStatus: response.status,
    requestId,
  })
}

/**
 * Orval mutator — returns `{ data, status, headers }` per generated client types.
 */
export const customFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const requestUrl = resolveUrl(url)

  let response: Response
  try {
    response = await fetch(requestUrl, options)
  } catch {
    throw ApiError.network()
  }

  const data = await readBody(response)
  const result = {
    data,
    status: response.status,
    headers: response.headers,
  } as T

  if (!response.ok) {
    throwApiError(response, data)
  }

  return result
}

export type BodyType<BodyData> = BodyData
