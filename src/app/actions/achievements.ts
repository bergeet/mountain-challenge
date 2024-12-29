"use server";

import { prisma } from "@/lib/prisma";
import { Achievement, AchievementType } from "@prisma/client";
import { NextResponse } from "next/server";

interface addAchievementToUserRequest {
  achievementTypeId: string;
  userId: string;
}

export async function addAchievementToUser(body: addAchievementToUserRequest) {
  const { achievementTypeId, userId } = body;

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new NextResponse("User not found", { status: 404 });
  }

  const achievementType = await prisma.achievementType.findFirst({
    where: {
      id: achievementTypeId,
    },
  });

  if (!achievementType) {
    throw new NextResponse("Achievement type not found", { status: 404 });
  }

  const existingAchievement = await prisma.achievement.findFirst({
    where: {
      userId: user.id,
      achievementTypeId: achievementType.id,
    },
  });

  if (existingAchievement) {
    throw new NextResponse("Achievement already exists", { status: 400 });
  }

  const achievement = await prisma.achievement.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      achievementType: {
        connect: {
          id: achievementType.id,
        },
      },
    },
  });

  return achievement;
}

export type AchievmentWithType = Achievement & {
  achievementType: AchievementType;
};

export async function getAchievementsForUser(
  userId: string
): Promise<AchievmentWithType[]> {
  const achievements = await prisma.achievement.findMany({
    where: {
      userId,
    },
    include: {
      achievementType: true,
    },
  });
  return achievements;
}

export async function getAchievementTypes() {
  const achievementTypes = await prisma.achievementType.findMany();
  return achievementTypes;
}
