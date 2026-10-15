import { NextRequest, NextResponse } from 'next/server';
import { db } from './db';
import { UserProfile, UserRole } from '@ilc/shared';

// For production tokens, use jsonwebtoken or JOSE with secret
const JWT_SECRET = process.env.JWT_SECRET || 'ilc_secure_local_dev_secret_key_928198273';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
}

export function generateToken(user: UserProfile): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  };
  const jsonStr = JSON.stringify(payload);
  const base64Payload = Buffer.from(jsonStr).toString('base64url');
  // Simple HMAC-like signature for local dev
  const signature = Buffer.from(`${base64Payload}.${JWT_SECRET}`).toString('base64url').slice(0, 32);
  return `${base64Payload}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [base64Payload, signature] = parts;
    const expectedSig = Buffer.from(`${base64Payload}.${JWT_SECRET}`).toString('base64url').slice(0, 32);
    if (signature !== expectedSig) return null;

    const payload: TokenPayload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

export function getUserFromRequest(req: NextRequest): UserProfile | null {
  const authHeader = req.headers.get('authorization');
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    // Check cookie
    const cookie = req.cookies.get('ilc_auth_token');
    if (cookie) token = cookie.value;
  }

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = db.findUserById(payload.userId);
  if (!user || user.account_status !== 'active') return null;

  return user;
}

export function requireAdmin(req: NextRequest): { errorResponse?: NextResponse; user?: UserProfile } {
  const user = getUserFromRequest(req);
  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      ),
    };
  }

  if (!['admin', 'editor', 'super_admin'].includes(user.role)) {
    return {
      errorResponse: NextResponse.json(
        { error: 'Forbidden: Insufficient privileges for editorial/admin operations' },
        { status: 403 }
      ),
    };
  }

  return { user };
}

export function requireMember(req: NextRequest): { errorResponse?: NextResponse; user?: UserProfile } {
  const user = getUserFromRequest(req);
  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { error: 'Unauthorized: Member authentication required' },
        { status: 401 }
      ),
    };
  }
  return { user };
}
