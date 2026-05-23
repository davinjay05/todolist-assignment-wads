// Ensure Firebase env vars exist during tests so the route doesn't return 500
process.env.FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'test-project';
process.env.FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL || 'test@example.com';
process.env.FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY || '-----BEGIN PRIVATE KEY-----\nTEST\n-----END PRIVATE KEY-----';

import { NextRequest } from "next/server";

jest.mock('../../../lib/firebase-admin', () => ({
  getAdminAuth: jest.fn(() => ({
    verifyIdToken: jest.fn().mockResolvedValue({ uid: '123', email: 'test@example.com' }),
    getUser: jest.fn().mockResolvedValue({ uid: '123', displayName: 'Test User', photoURL: null }),
  })),
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
    } as unknown as NextRequest

    const response = await POST(mockRequest)

    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.status).toBe('success')
  })
})