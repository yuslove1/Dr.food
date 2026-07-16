import { prisma } from "../../lib/prisma";
import { HttpError } from "../../lib/http-error";
import type { FamilyMemberInput, HealthProfileInput } from "./users.schemas";

export async function upsertHealthProfile(userId: string, input: HealthProfileInput) {
  return prisma.healthProfile.upsert({
    where: { userId },
    update: input,
    create: { userId, ...input },
  });
}

export async function getHealthProfile(userId: string) {
  return prisma.healthProfile.findUnique({ where: { userId } });
}

export async function listFamilyMembers(userId: string) {
  return prisma.familyMember.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
}

export async function addFamilyMember(userId: string, input: FamilyMemberInput) {
  return prisma.familyMember.create({ data: { userId, ...input } });
}

export async function updateFamilyMember(userId: string, memberId: string, input: Partial<FamilyMemberInput>) {
  const member = await prisma.familyMember.findUnique({ where: { id: memberId } });
  if (!member || member.userId !== userId) {
    throw HttpError.notFound("Family member not found");
  }
  return prisma.familyMember.update({ where: { id: memberId }, data: input });
}

export async function removeFamilyMember(userId: string, memberId: string) {
  const member = await prisma.familyMember.findUnique({ where: { id: memberId } });
  if (!member || member.userId !== userId) {
    throw HttpError.notFound("Family member not found");
  }
  await prisma.familyMember.delete({ where: { id: memberId } });
}
