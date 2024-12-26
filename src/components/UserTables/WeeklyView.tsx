import { getAttributesTypes, getValidityClass } from "@/lib/utils";
import {
    ChallengeType,
    User
} from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { CheckInTypeCombined } from "./UserTables";

const tableConfigurations: Record<
  ChallengeType,
  { label: string; attribute: keyof CheckInTypeCombined }[]
> = {
  RUNNING: [
    { label: "Skapades", attribute: "createdAt" },
    { label: "Längd (km)", attribute: "km" },
    { label: "Tid", attribute: "minutes" },
    { label: "Tid promenad", attribute: "walkingMinutes" },
  ],
  WEIGHTLOSS: [
    { label: "Skapades", attribute: "createdAt" },
    { label: "Åt lunch", attribute: "ateLunch" },
    { label: "Åt middag", attribute: "ateDinner" },
    { label: "Åt snacks", attribute: "ateSugar" },
    { label: "Tid promenad", attribute: "walkingMinutes" },
  ],
};

interface WeeklyViewProps {
  user: User;
  checkIn: CheckInTypeCombined[] | null;
  removeRow: (id: string) => void;
}

export function WeeklyView({ user, checkIn, removeRow }: WeeklyViewProps) {
  const columns = tableConfigurations[user.challengeType];
  return (
    <Table key={user.id} className="w-full border border-gray-200">
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.label} className="w-full">
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="min-w-48">
        {checkIn?.map((checkIn, i) => (
          <TableRow
            key={i}
            style={{
              color: "black",
              backgroundColor: checkIn.ateSugar ? "bg-red-200" : "bg-green-200",
            }}
            className={`${getValidityClass(!checkIn.ateSugar)}`}
          >
            {columns.map((col, i) => (
              <TableCell key={i} className="w-full">
                {getAttributesTypes(checkIn[col.attribute])}
              </TableCell>
            ))}
            <TableCell className="w-full">
              <button
                onClick={() => {
                  removeRow(checkIn.id);
                }}
              >
                💣
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
