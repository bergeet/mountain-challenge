import { getAttributesTypes, getValidityClass, cn } from "@/lib/utils";
import { ChallengeType, User } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { CheckInTypeCombined } from "./UserTables";
import { CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { BadgeCheck, BadgeX, Trash2 } from "lucide-react";

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
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.label} className="text-right">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {checkIn?.map((checkInItem) => (
              <TableRow
                key={checkInItem.id}
                className={`transition-colors hover:bg-gray-100 hover:text-black`}
              >
                <TableCell>
                 {checkInItem.ateSugar ? <BadgeX className="text-red-400" /> :  <BadgeCheck className="text-green-400"/>}
                </TableCell>
                {columns.map((col) => (
                  <TableCell key={col.attribute} className="text-right">
                    {getAttributesTypes(checkInItem[col.attribute])}
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(checkInItem.id)}
                    aria-label="Remove check-in"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  );
}
