import axios from 'axios'

export const SUCCESS_CODES = new Set([0, 200, '0', '200'])

function createRequestError(message, details = {}) {
  const error = new Error(message || 'Request failed')
  Object.assign(error, details)
  return error
}

export function normalizeResponse(response) {
  const body = response?.data

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return body
  }

  if (!Object.prototype.hasOwnProperty.call(body, 'code')) {
    return body
  }

  if (!SUCCESS_CODES.has(body.code)) {
    throw createRequestError(body.message || body.msg || 'Request failed', {
      code: body.code,
      status: response?.status,
    })
  }

  return Object.prototype.hasOwnProperty.call(body, 'data') ? body.data : body
}

export function normalizeRequestError(cause) {
  if (cause instanceof Error && !cause.response) return cause

  const message =
    cause?.response?.data?.message ||
    cause?.response?.data?.msg ||
    cause?.message ||
    'Network request failed'

  return createRequestError(message, {
    code: cause?.response?.data?.code,
    status: cause?.response?.status,
    cause,
  })
}

const request = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 15000,
})

request.interceptors.response.use(
  normalizeResponse,
  (error) => Promise.reject(normalizeRequestError(error)),
)

export default request
