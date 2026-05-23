jest.mock('../../../lib/firebase-admin', () => ({
  adminAuth: {
    verifyIdToken: jest.fn().mockResolvedValue({ uid: '123' }),
  },
}))

jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: Record<string, unknown>, init?: { status?: number }) => ({
      status: init?.status || 200,
      json: async () => data,
      cookies: {
        set: jest.fn(),
      },
    }),
  },
}))

import { POST } from './route'

describe('POST /api/session', () => {
  it('returns success for valid token', async () => {
    const mockRequest = {
      headers: {
        get: jest.fn().mockReturnValue('Bearer valid-token'),
      },
    } as any 

    const response = await POST(mockRequest)

    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.status).toBe('success')
  })
})