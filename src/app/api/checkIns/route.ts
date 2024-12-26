import { CheckInTypeCombined } from "@/components/UserTables/UserTables";
import { prisma } from "@/lib/prisma";
import { ChallengeType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
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
  }: CheckInTypeCombined & { userId: string } = await req.json();

  console.log({
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
  });
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  let checkIn;
  if (challengeType === ChallengeType.RUNNING) {
    const chosenDate = new Date(createdAt);

    checkIn = await prisma.checkInRunning.upsert({
      where: {
        userId_createdAt: {
          userId: user.id,
          createdAt: chosenDate,
        },
      },
      update: {
        walkingMinutes,
        km,
        minutes,
        challengeType,
      },
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
    const chosenDate = new Date(createdAt);
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
  revalidatePath("/");
  revalidatePath("/api/checkIns");

  return new Response(JSON.stringify(checkIn), { status: 200 });
}

export async function DELETE(req: Request) {
  const { id, type } = await req.json();

  if (type === ChallengeType.RUNNING) {
    await prisma.checkInRunning.delete({
      where: {
        id,
      },
    });
  } else if (type === ChallengeType.WEIGHTLOSS) {
    await prisma.checkInWeightLoss.delete({
      where: {
        id,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/api/checkIns");
  return new Response("Deleted", { status: 200 });
}
