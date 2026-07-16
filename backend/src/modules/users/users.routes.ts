import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler";
import { requireAuth, type AuthenticatedRequest } from "../../middleware/auth";
import { healthProfileSchema, familyMemberSchema } from "./users.schemas";
import * as usersService from "./users.service";

export const usersRouter = Router();
usersRouter.use(requireAuth);

usersRouter.get(
  "/profile",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const profile = await usersService.getHealthProfile(req.user!.id);
    res.json(profile);
  })
);

usersRouter.put(
  "/profile",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = healthProfileSchema.parse(req.body);
    const profile = await usersService.upsertHealthProfile(req.user!.id, input);
    res.json(profile);
  })
);

usersRouter.get(
  "/family",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const members = await usersService.listFamilyMembers(req.user!.id);
    res.json(members);
  })
);

usersRouter.post(
  "/family",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = familyMemberSchema.parse(req.body);
    const member = await usersService.addFamilyMember(req.user!.id, input);
    res.status(201).json(member);
  })
);

usersRouter.put(
  "/family/:memberId",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = familyMemberSchema.partial().parse(req.body);
    const member = await usersService.updateFamilyMember(req.user!.id, req.params.memberId, input);
    res.json(member);
  })
);

usersRouter.delete(
  "/family/:memberId",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    await usersService.removeFamilyMember(req.user!.id, req.params.memberId);
    res.status(204).send();
  })
);
