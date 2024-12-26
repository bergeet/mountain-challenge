"use server";

import { UserTables } from "@/components/UserTables/UserTables";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUsers } from "./actions/checkins";

//import dayjs from 'dayjs' // ES 2015
export default async function Home() {
  const users = await getUsers();

  // const runningCheckIns = await prisma.checkInRunning.findMany();
  // const weightLossCheckIns = await prisma.checkInWeightLoss.findMany();

  return (
    <div className="flex flex-col  min-h-screen py-2 m-20">
      <div className="flex flex-col gap-18 ">
        <Tabs defaultValue={users[0].id}>
          <TabsList className="flex flex-row w-full gap-8 md-8">
            {users.map((user) => (
              <>
                <TabsTrigger value={user.id}>{user.name}</TabsTrigger>
              </>
            ))}
          </TabsList>
          {users.map((user) => (
            <TabsContent value={user.id} key={user.id}>
              <UserTables key={user.id} user={user} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
