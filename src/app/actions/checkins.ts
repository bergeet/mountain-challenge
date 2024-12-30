"use server";

import { CheckInTypeCombined } from "@/components/UserTables/UserTables";
import { prisma } from "@/lib/prisma";
import {
  ChallengeType,
  CheckInRunning,
  CheckInWeightLoss,
} from "@prisma/client";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function createOrUpdateCheckInRunning(
  data: Omit<CheckInRunning, "id"> & { userId: string }
) {
  const { walkingMinutes, km, minutes, createdAt, userId } = data;

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const existingCheckin = await prisma.checkInRunning.findFirst({
    where: {
      userId: user.id,
      createdAt: {
        gte: dayjs(createdAt).startOf("day").toDate(),
        lte: dayjs(createdAt).endOf("day").toDate(),
      },
    },
  });

  if (existingCheckin) {
    throw new NextResponse("Checkin already exists", { status: 400 });
  }

  const checkIn = await prisma.checkInRunning.upsert({
    where: {
      userId_createdAt: {
        userId: user.id,
        createdAt,
      },
    },
    update: {
      walkingMinutes,
      km,
      minutes,
      challengeType: ChallengeType.RUNNING,
    },
    create: {
      createdAt,
      user: { connect: { id: user.id } },
      walkingMinutes,
      km,
      minutes,
      challengeType: ChallengeType.RUNNING,
    },
  });

  revalidatePath("/", "layout");
  return checkIn;
}

export async function createOrUpdateCheckInWeightLoss(
  data: Omit<CheckInWeightLoss, "id"> & { userId: string }
) {
  const {
    walkingMinutes,
    ateDinner,
    ateLunch,
    ateSugar,
    wentToGym,
    createdAt,
    userId,
  } = data;

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const existingCheckin = await prisma.checkInWeightLoss.findFirst({
    where: {
      userId: user.id,
      createdAt: {
        gte: dayjs(createdAt).startOf("day").toDate(),
        lte: dayjs(createdAt).endOf("day").toDate(),
      },
    },
  });

  if (existingCheckin) {
    throw new Error("Checkin already exists");
  }

  const checkIn = await prisma.checkInWeightLoss.upsert({
    where: {
      userId_createdAt: {
        userId: user.id,
        createdAt,
      },
    },
    update: {
      walkingMinutes,
      ateDinner,
      ateLunch,
      ateSugar,
      wentToGym,
      challengeType: ChallengeType.WEIGHTLOSS,
    },
    create: {
      createdAt,
      user: { connect: { id: user.id } },
      walkingMinutes,
      ateDinner,
      ateLunch,
      ateSugar,
      wentToGym,
      challengeType: ChallengeType.WEIGHTLOSS,
    },
  });

  revalidatePath("/", "layout");
  return checkIn;
}

export async function createOrUpdateCheckIn(
  data: CheckInTypeCombined & { userId: string }
) {
  const {
    walkingMinutes,
    ateDinner,
    ateLunch,
    ateSugar,
    wentToGym,
    challengeType,
    userId,
    km,
    minutes,
    createdAt,
  } = data;

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  let checkIn;
  const chosenDate = new Date(createdAt);

  if (challengeType === ChallengeType.RUNNING) {
    checkIn = await prisma.checkInRunning.upsert({
      where: {
        userId_createdAt: {
          userId: user.id,
          createdAt: chosenDate,
        },
      },
      update: { walkingMinutes, km, minutes, challengeType },
      create: {
        createdAt: chosenDate,
        user: { connect: { id: user.id } },
        walkingMinutes,
        km,
        minutes,
        challengeType,
      },
    });
  } else if (challengeType === ChallengeType.WEIGHTLOSS) {
    checkIn = await prisma.checkInWeightLoss.upsert({
      where: {
        userId_createdAt: {
          userId: user.id,
          createdAt: chosenDate,
        },
      },
      update: {
        walkingMinutes,
        ateDinner,
        ateLunch,
        ateSugar,
        wentToGym,
        challengeType,
      },
      create: {
        createdAt: chosenDate,
        user: { connect: { id: user.id } },
        walkingMinutes,
        ateDinner,
        ateLunch,
        ateSugar,
        wentToGym,
        challengeType,
      },
    });
  }

  revalidatePath("/", "layout");
  return checkIn;
}

export async function deleteCheckIn(id: string, type: ChallengeType) {
  if (type === ChallengeType.RUNNING) {
    await prisma.checkInRunning.delete({ where: { id } });
  } else if (type === ChallengeType.WEIGHTLOSS) {
    await prisma.checkInWeightLoss.delete({ where: { id } });
  }

  revalidatePath("/", "layout");
}

export async function getCheckIns(
  id: string,
  type: string,
  intervalFrom: string,
  intervalTo: string
) {
  if (type === ChallengeType.RUNNING) {
    return await prisma.checkInRunning.findMany({
      where: {
        userId: id,
        createdAt: {
          gte: intervalFrom,
          lte: intervalTo,
        },
      },
    });
  } else if (type === ChallengeType.WEIGHTLOSS) {
    return await prisma.checkInWeightLoss.findMany({
      where: {
        userId: id,
        createdAt: {
          gte: intervalFrom,
          lte: intervalTo,
        },
      },
    });
  }

  throw new Error("Invalid challenge type");
}

export async function getUsers() {
  return await prisma.user.findMany();
}
