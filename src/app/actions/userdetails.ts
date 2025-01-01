"use server";

import { prisma } from "@/lib/prisma";
import { UserDetails } from "@prisma/client";

export async function getUserDetails(userId: string): Promise<UserDetails[]> {
  const details = await prisma.userDetails.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return details;
}
