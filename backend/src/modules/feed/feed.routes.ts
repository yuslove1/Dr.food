import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../lib/async-handler";
import { requireAuth, type AuthenticatedRequest } from "../../middleware/auth";
import { prisma } from "../../lib/prisma";

// Scaffold only — discover tab, stories, moderation tools, and promoted listings are a
// future pass (see plan: "Social Feed" is schema + thin routes for this build).
export const feedRouter = Router();

feedRouter.get(
  "/posts",
  asyncHandler(async (_req, res) => {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { id: true, fullName: true } },
        foodItem: true,
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json(posts);
  })
);

const createPostSchema = z.object({
  caption: z.string().optional(),
  imageUrl: z.string().url(),
  foodItemId: z.string().optional(),
});

feedRouter.post(
  "/posts",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = createPostSchema.parse(req.body);
    const post = await prisma.post.create({
      data: { authorId: req.user!.id, authorType: "USER", ...input },
    });
    res.status(201).json(post);
  })
);

feedRouter.post(
  "/posts/:id/like",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    await prisma.like.upsert({
      where: { postId_userId: { postId: req.params.id, userId: req.user!.id } },
      update: {},
      create: { postId: req.params.id, userId: req.user!.id },
    });
    res.status(204).send();
  })
);

feedRouter.delete(
  "/posts/:id/like",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    await prisma.like.deleteMany({ where: { postId: req.params.id, userId: req.user!.id } });
    res.status(204).send();
  })
);

const commentSchema = z.object({ body: z.string().min(1) });

feedRouter.post(
  "/posts/:id/comments",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = commentSchema.parse(req.body);
    const comment = await prisma.comment.create({
      data: { postId: req.params.id, userId: req.user!.id, body: input.body },
    });
    res.status(201).json(comment);
  })
);

feedRouter.post(
  "/users/:id/follow",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    await prisma.follow.upsert({
      where: { followerId_followingId: { followerId: req.user!.id, followingId: req.params.id } },
      update: {},
      create: { followerId: req.user!.id, followingId: req.params.id },
    });
    res.status(204).send();
  })
);
