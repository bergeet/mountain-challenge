import { DeleteCheckInButton } from "../DeleteCheckIn/DeleteCheckInButton";
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../ui/table";
import {
  getValidityClass,
  getFeelingClass,
  getBooleanValueYesOrNo,
} from "@/lib/utils";
import { CheckInRunning, CheckInWeightLoss, User } from "@prisma/client";

interface UserTablesProps {
  users: User[];
  runningCheckIns: CheckInRunning[];
  weightLossCheckIns: CheckInWeightLoss[];
}

export function UserTables({
  users,
  runningCheckIns,
  weightLossCheckIns,
}: UserTablesProps) {
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

  return <div className="w-full">{createUserTables()}</div>;
}
