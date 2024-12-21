import { prisma } from "@/lib/prisma";

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
        challengeType: 1,
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
        challengeType: 2,
      },
    });
  }

  return new Response("User created", { status: 200 });
}
