import crypto from 'node:crypto';

const COOKIE_NAME = 'admin_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;

const adminPassword = () => process.env.ADMIN_PASSWORD || '';
const sessionSecret = () => process.env.ADMIN_SESSION_SECRET || adminPassword();

export const authConfigured = () => adminPassword().length > 0;

const sign = (payload) =>
  crypto.createHmac('sha256', sessionSecret()).update(payload).digest('base64url');

const safeEqual = (a, b) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
};

export function checkPassword(input) {
  if (!authConfigured() || typeof input !== 'string' || !input) return false;
  const expected = crypto.createHash('sha256').update(adminPassword()).digest();
  const actual = crypto.createHash('sha256').update(input).digest();
  return crypto.timingSafeEqual(expected, actual);
}

export function createSessionCookie({ secure = true } = {}) {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + SESSION_TTL_SECONDS * 1000 })
  ).toString('base64url');
  const parts = [
    `${COOKIE_NAME}=${payload}.${sign(payload)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${SESSION_TTL_SECONDS}`
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export function clearSessionCookie({ secure = true } = {}) {
  const parts = [`${COOKIE_NAME}=`, 'Path=/', 'HttpOnly', 'SameSite=Strict', 'Max-Age=0'];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export function readSession(cookieHeader) {
  if (!authConfigured() || !sessionSecret() || !cookieHeader) return null;

  const token = cookieHeader
    .split(';')
    .map((chunk) => chunk.trim())
    .find((chunk) => chunk.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);

  if (!token) return null;

  const [payload, signature] = token.split('.');
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof session.exp === 'number' && session.exp > Date.now() ? session : null;
  } catch {
    return null;
  }
}
