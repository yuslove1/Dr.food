import { prisma } from "../../lib/prisma";
import { hashPassword, comparePassword } from "../../lib/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../lib/jwt";
import { sha256 } from "../../lib/hash";
import { HttpError } from "../../lib/http-error";
import { env } from "../../config/env";
import type { LoginInput, SignupInput } from "./auth.schemas";

const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function publicUser(user: { id: string; fullName: string; email: string | null; phone: string | null; role: string }) {
  return { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, role: user.role };
}

async function issueTokens(user: { id: string; role: string }) {
  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: sha256(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    },
  });

  return { accessToken, refreshToken };
}

export async function signup(input: SignupInput) {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        input.email ? { email: input.email } : undefined,
        input.phone ? { phone: input.phone } : undefined,
      ].filter(Boolean) as Array<{ email: string } | { phone: string }>,
    },
  });

  if (existing) {
    throw HttpError.conflict("An account with this email or phone already exists");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      passwordHash,
      wallet: { create: { balance: 0 } },
    },
  });

  const tokens = await issueTokens(user);
  return { user: publicUser(user), ...tokens };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findFirst({
    where: input.email ? { email: input.email } : { phone: input.phone },
  });

  if (!user || !(await comparePassword(input.password, user.passwordHash))) {
    throw HttpError.unauthorized("Invalid credentials");
  }

  const tokens = await issueTokens(user);
  return { user: publicUser(user), ...tokens };
}

export async function refresh(refreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw HttpError.unauthorized("Invalid or expired refresh token");
  }

  const tokenHash = sha256(refreshToken);
  const stored = await prisma.refreshToken.findFirst({
    where: { tokenHash, userId: payload.sub, revoked: false },
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw HttpError.unauthorized("Refresh token no longer valid");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    throw HttpError.unauthorized("User no longer exists");
  }

  await prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } });

  const tokens = await issueTokens(user);
  return { user: publicUser(user), ...tokens };
}

export async function logout(refreshToken: string | undefined) {
  if (!refreshToken) return;
  const tokenHash = sha256(refreshToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revoked: true },
  });
}

export const refreshCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: REFRESH_TTL_MS,
  path: "/auth",
};

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { healthProfile: true },
  });
  if (!user) throw HttpError.notFound("User not found");
  return {
    ...publicUser(user),
    onboardingComplete: Boolean(user.healthProfile),
  };
}
