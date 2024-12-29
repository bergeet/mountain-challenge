"use server";

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { points, name, description } = await req.json();
  const achievementType = await prisma.achievementType.create({
    data: {
      points,
      name,
      description,
    },
  });
  return NextResponse.json(achievementType);
}
