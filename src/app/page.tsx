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

import { RunningCheckInForm } from "@/components/Forms/RunningCheckInForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeightLossCheckIn } from "@/components/Forms/WeightLossCheckIn";
import { DeleteCheckInButton } from "@/components/DeleteCheckIn/DeleteCheckInButton";

const getBooleanValueYesOrNo = (value: boolean) => (value ? "Ja" : "Nej");
const getValidityClass = (value: boolean) =>
  value ? "bg-green-500" : "bg-red-500";
const getFeelingClass = (value: number) => {
  switch (value) {
    case 1:
      return "bg-red-500";
    case 2:
    case 3:
      return "bg-yellow-500";
    case 4:
      return "bg-green-500";
    case 5:
      return "bg-blue-500";
  }
};

export default async function Home() {
  const users = await prisma.user.findMany();
  const runningCheckIns = await prisma.checkInRunning.findMany();
  const weightLossCheckIns = await prisma.checkInWeightLoss.findMany();

  await fetch("/api/seed", {
    method: "POST",
  });

  const createUserTables = async () => {
    return users.map(async (user) => {
      const runningCheckInsForuser = runningCheckIns.filter(
        (checkIn) => checkIn.userId === user.id
      );
      const weightLossCheckInsForUser = weightLossCheckIns.filter(
        (checkIn) => checkIn.userId === user.id
      );

      return (
        <Table key={user.id} className="w-full border border-gray-200">
          <TableCaption>{user.name}</TableCaption>
          <TableHeader>
            {runningCheckInsForuser?.length > 0 ? (
              <TableRow>
                <TableHead className="w-[100px]">Skapades</TableHead>
                <TableHead className="w-[100px]">Tid 5 km</TableHead>
                <TableHead className="w-[100px]">Tid 10 km</TableHead>
                <TableHead className="w-[100px]">Tid promenad</TableHead>
                <TableHead className="w-[100px]">Känsla</TableHead>
              </TableRow>
            ) : weightLossCheckInsForUser?.length > 0 ? (
              <TableRow>
                <TableHead className="w-[100px]">Skapades</TableHead>
                <TableHead className="w-[100px]">Åt lunch</TableHead>
                <TableHead className="w-[100px]">Åt middag</TableHead>
                <TableHead className="w-[100px]">Åt socker</TableHead>
                <TableHead className="w-[100px]">Tid promenad</TableHead>
                <TableHead className="w-[100px]">Känsla</TableHead>
              </TableRow>
            ) : null}
          </TableHeader>
          <TableBody>
            {runningCheckInsForuser?.length > 0
              ? runningCheckInsForuser.map(async (checkIn) => (
                  <TableRow key={checkIn.id}>
                    <TableCell>
                      {checkIn.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      className={`w-[100px] ${getValidityClass(
                        !!checkIn.halfMileMinutes
                      )}`}
                    >
                      {checkIn.halfMileMinutes}
                    </TableCell>
                    <TableCell
                      className={`w-[100px] ${getValidityClass(
                        !!checkIn.mileMinutes
                      )}`}
                    >
                      {checkIn.mileMinutes}
                    </TableCell>
                    <TableCell
                      className={`w-[100px] ${getValidityClass(
                        !!checkIn.walkingMinutes
                      )}`}
                    >
                      {checkIn.walkingMinutes}
                    </TableCell>
                    <TableCell className={getFeelingClass(checkIn.feeling)}>
                      {checkIn.feeling}
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <DeleteCheckInButton
                        checkInId={checkIn.id}
                        type="running"
                      />
                    </TableCell>
                  </TableRow>
                ))
              : weightLossCheckInsForUser?.length > 0
              ? weightLossCheckInsForUser.map((checkIn) => (
                  <TableRow key={checkIn.id}>
                    <TableCell>
                      {checkIn.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getBooleanValueYesOrNo(checkIn.ateLunch)}
                    </TableCell>
                    <TableCell>
                      {getBooleanValueYesOrNo(checkIn.ateDinner)}
                    </TableCell>
                    <TableCell
                      className={`w-[100px] ${getValidityClass(
                        !checkIn.ateSugar
                      )}`}
                    >
                      {getBooleanValueYesOrNo(checkIn.ateSugar)}
                    </TableCell>
                    <TableCell>{checkIn.walkingMinutes}</TableCell>
                    <TableCell className={getFeelingClass(checkIn.feeling)}>
                      {checkIn.feeling}
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <DeleteCheckInButton
                        checkInId={checkIn.id}
                        type="weightLoss"
                      />
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      );
    });
  };

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="text-4xl font-bold">Check-ins</div>
      <div>
        <Tabs defaultValue="elliot" className="border border-gray-200 p-4">
          <TabsList className="flex gap-4">
            <TabsTrigger className="w-[200px]" value="elliot">
              Elliot
            </TabsTrigger>
            <TabsTrigger className="w-[200px]" value="liam">
              Liam
            </TabsTrigger>
          </TabsList>
          <TabsContent value="elliot">
            <RunningCheckInForm />
          </TabsContent>
          <TabsContent value="liam">
            <WeightLossCheckIn />
          </TabsContent>
        </Tabs>
      </div>

      <ul className="flex flex-col gap-20">{createUserTables()}</ul>
    </div>
  );
}
