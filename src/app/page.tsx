import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DeleteCheckInButton } from "@/components/DeleteCheckIn/DeleteCheckInButton";
import { CheckIn } from "@/components/CheckIn/CheckIn";
import { UserTables } from "@/components/UserTables/UserTables";

export default async function Home() {
  const users = await prisma.user.findMany();
  const runningCheckIns = await prisma.checkInRunning.findMany();
  const weightLossCheckIns = await prisma.checkInWeightLoss.findMany();

  await fetch(process.env.URL + "/api/seed", {
    method: "POST",
  });

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <CheckIn />

      <div className="flex flex-col gap-20">
        <UserTables
          users={users}
          runningCheckIns={runningCheckIns}
          weightLossCheckIns={weightLossCheckIns}
        />
      </div>
    </div>
  );
}
