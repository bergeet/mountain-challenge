import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const type = url.searchParams.get("type");
  if (!id) {
    return new Response("No id provided", { status: 400 });
  }
  if (!type) {
    return new Response("No type provided", { status: 400 });
  }
  if (parseFloat(type) === 1) {
    const checkins = await prisma.checkInRunning.findMany({
      where: {
        userId: id,
      },
    });
    return new Response(JSON.stringify(checkins), { status: 200 });
  } else if (parseFloat(type) === 2) {
    const checkins = await prisma.checkInWeightLoss.findMany({
      where: {
        userId: id,
      },
    });
    return new Response(JSON.stringify(checkins), { status: 200 });
  }
}
