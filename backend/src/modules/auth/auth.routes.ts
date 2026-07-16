import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler";
import { requireAuth, type AuthenticatedRequest } from "../../middleware/auth";
import { signupSchema, loginSchema } from "./auth.schemas";
import * as authService from "./auth.service";

export const authRouter = Router();
const REFRESH_COOKIE_NAME = "drfoods_refresh";

authRouter.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const input = signupSchema.parse(req.body);
    const { refreshToken, ...result } = await authService.signup(input);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, authService.refreshCookieOptions);
    res.status(201).json(result);
  })
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const input = loginSchema.parse(req.body);
    const { refreshToken, ...result } = await authService.login(input);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, authService.refreshCookieOptions);
    res.json(result);
  })
);

authRouter.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ error: "Missing refresh token" });
    }
    const { refreshToken, ...result } = await authService.refresh(token);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, authService.refreshCookieOptions);
    res.json(result);
  })
);

authRouter.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];
    await authService.logout(token);
    res.clearCookie(REFRESH_COOKIE_NAME, { path: "/auth" });
    res.status(204).send();
  })
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const me = await authService.getMe(req.user!.id);
    res.json(me);
  })
);
