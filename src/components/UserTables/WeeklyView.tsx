import { getAttributesTypes } from "@/lib/utils";
import { ChallengeType, User } from "@prisma/client";
import { BadgeCheck, BadgeX, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
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
  SMOKING: [
    { label: "Skapades", attribute: "createdAt" },
    { label: "Rökte", attribute: "smokedCigarettes" },
    { label: "Tid promenad", attribute: "walkingMinutes" },
  ],
  GYM: [
    { label: "Skapades", attribute: "createdAt" },
    { label: "Gick till gymmet", attribute: "wentToGym" },
    { label: "Tid promenad", attribute: "walkingMinutes" },
  ]

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
          <TableHeader className="hidden md:table-header-group">
            <TableRow>
              <TableHead className="w-[50px]">Godkänd</TableHead>
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
                className="flex flex-col mb-4 border-b md:table-row md:mb-0"
              >
                <TableCell className="flex justify-between items-center py-2 md:table-cell">
                  <span className="md:hidden font-bold">Godkänd:</span>
                  {checkInItem.ateSugar ? (
                    <BadgeX className="text-red-400" />
                  ) : (
                    <BadgeCheck className="text-green-400" />
                  )}
                </TableCell>
                {columns.map((col) => (
                  <TableCell
                    key={col.attribute}
                    className="flex justify-between items-center py-2 md:table-cell md:text-right"
                  >
                    <span className="md:hidden font-bold">{col.label}:</span>
                    {getAttributesTypes(checkInItem[col.attribute])}
                  </TableCell>
                ))}
                <TableCell className="flex justify-end py-2 md:table-cell">
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
