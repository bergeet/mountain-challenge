import { prisma } from "@/lib/prisma";
import { ChallengeType } from "@prisma/client";

export async function POST() {
  const elliot = await prisma.user.findFirst({
    where: {
      name: "Elliot",
    },
  });
  if (!elliot) {
    await prisma.user.create({
      data: {
        name: "Elliot",
        password: "password",
        challengeType: ChallengeType.RUNNING,
      },
    });
  }

  const liam = await prisma.user.findFirst({
    where: {
      name: "Liam",
    },
  });
  if (!liam) {
    await prisma.user.create({
      data: {
        name: "Liam",
        password: "password",
        challengeType: ChallengeType.WEIGHTLOSS,
      },
    });
  }

  return new Response("User created", { status: 200 });
}
