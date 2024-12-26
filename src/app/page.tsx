import { prisma } from "@/lib/prisma";
import { UserTables } from "@/components/UserTables/UserTables";

export default async function Home() {
  const users = await prisma.user.findMany();
  // const runningCheckIns = await prisma.checkInRunning.findMany();
  // const weightLossCheckIns = await prisma.checkInWeightLoss.findMany();

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-20">
        {users.map((user) => (
          <>
            <UserTables key={user.id} user={user} />
          </>
        ))}
      </div>
    </div>
  );
}
