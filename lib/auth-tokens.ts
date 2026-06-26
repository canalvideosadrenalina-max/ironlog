import { createHmac, randomInt, timingSafeEqual } from "crypto";

const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const REGISTRATION_MAX_AGE_MS = 10 * 60 * 1000;

function getSecret(): string {
  const secret = process.env.IRONLOG_SESSION_SECRET;
  if (!secret) {
    throw new Error("IRONLOG_SESSION_SECRET não configurado");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function encodePayload(parts: Record<string, string | number>): string {
  return Buffer.from(JSON.stringify(parts)).toString("base64url");
}

function decodePayload(token: string): Record<string, string | number> | null {
  try {
    return JSON.parse(Buffer.from(token, "base64url").toString("utf8")) as Record<
      string,
      string | number
    >;
  } catch {
    return null;
  }
}

function verifySignedToken(token: string, type: string) {
  const [payloadPart, signature] = token.split(".");
  if (!payloadPart || !signature) return null;

  const expected = sign(`${type}:${payloadPart}`);
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    sigBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return null;
  }

  const payload = decodePayload(payloadPart);
  if (!payload || payload.type !== type) return null;

  const exp = Number(payload.exp);
  if (!exp || Date.now() > exp) return null;

  return payload;
}

export function generateOtpCode(): string {
  return String(randomInt(100000, 999999));
}

export function createSessionToken(userId: string, phone: string): string {
  const payloadPart = encodePayload({
    type: "session",
    userId,
    phone,
    exp: Date.now() + SESSION_MAX_AGE_MS,
  });
  const signature = sign(`session:${payloadPart}`);
  return `${payloadPart}.${signature}`;
}

export function createRegistrationToken(phone: string): string {
  const payloadPart = encodePayload({
    type: "registration",
    phone,
    exp: Date.now() + REGISTRATION_MAX_AGE_MS,
  });
  const signature = sign(`registration:${payloadPart}`);
  return `${payloadPart}.${signature}`;
}

export function verifySessionToken(token: string) {
  const payload = verifySignedToken(token, "session");
  if (!payload) return null;
  return {
    userId: String(payload.userId),
    phone: String(payload.phone),
  };
}

export function verifyRegistrationToken(token: string) {
  const payload = verifySignedToken(token, "registration");
  if (!payload) return null;
  return { phone: String(payload.phone) };
}

export const SESSION_COOKIE = "ironlog_session";
export const SESSION_MAX_AGE_SEC = SESSION_MAX_AGE_MS / 1000;
