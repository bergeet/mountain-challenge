import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const {
    walkingMinutes,
    halfMileMinutes,
    mileMinutes,
    feeling,
    type,
    ateDinner,
    ateLunch,
    ateSugar,
    wentToGym,
    name,
  } = await req.json();
  const user = await prisma.user.findFirst({
    where: {
      name: name,
    },
  });
  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  let checkIn;
  if (type === "running") {
    checkIn = await prisma.checkInRunning.create({
      data: {
        createdAt: new Date(),
        user: { connect: { id: user.id } },
        walkingMinutes,
        halfMileMinutes,
        mileMinutes,
        feeling,
      },
    });
  } else {
    checkIn = await prisma.checkInWeightLoss.create({
      data: {
        createdAt: new Date(),
        user: { connect: { id: user.id } },
        walkingMinutes,
        ateDinner,
        ateLunch,
        ateSugar,
        feeling,
        wentToGym,
      },
    });
  }
  revalidatePath("/");
  return new Response(JSON.stringify(checkIn), { status: 200 });
}

export async function GET() {
  const checkIns = await prisma.checkInRunning.findMany();
  return new Response(JSON.stringify(checkIns), { status: 200 });
}

export async function DELETE(req: Request) {
  const { id, type } = await req.json();

  if (type === "running") {
    await prisma.checkInRunning.delete({
      where: {
        id,
      },
    });
  } else {
    await prisma.checkInWeightLoss.delete({
      where: {
        id,
      },
    });
  }

  revalidatePath("/");
  return new Response("Deleted", { status: 200 });
}
